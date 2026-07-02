"""
Vennela Portfolio — Backend
A small, intentional API that powers the contact form.
"""
import os
import asyncio
import logging
import resend
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_ipaddr
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio")

RESEND_API_KEY = os.environ["RESEND_API_KEY"]
SENDER_EMAIL = os.environ["SENDER_EMAIL"]
CONTACT_RECIPIENT = os.environ["CONTACT_RECIPIENT"]

resend.api_key = RESEND_API_KEY

# ── App ───────────────────────────────────────────────────
# get_ipaddr honours X-Forwarded-For so each real client gets its own bucket
# behind the Kubernetes ingress.
limiter = Limiter(key_func=get_ipaddr)

app = FastAPI(title="Vennela Portfolio API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://portfolio-alpha-self-67.vercel.app",
    
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


# ── Models ───────────────────────────────────────────────
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=4000)
    # honeypot — must remain empty; bots fill it
    company: str = Field(default="", max_length=200)


# ── Email template ───────────────────────────────────────
def build_email_html(name: str, email: str, message: str) -> str:
    safe_message = (
        message.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )
    safe_name = name.replace("<", "&lt;").replace(">", "&gt;")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f0;font-family:Georgia,'Cormorant Garamond',serif;padding:32px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fffefb;border:1px solid #e8e0cf;border-radius:14px;padding:36px 40px;">
          <tr><td style="font-size:13px;color:#a08a5a;letter-spacing:3px;text-transform:uppercase;padding-bottom:8px;">a butterfly arrived</td></tr>
          <tr><td style="font-size:26px;color:#1a2920;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;padding-bottom:22px;">A new note from your garden</td></tr>
          <tr><td style="font-size:14px;color:#3a4a3f;padding:6px 0;"><strong>From:</strong> {safe_name}</td></tr>
          <tr><td style="font-size:14px;color:#3a4a3f;padding:6px 0 18px;"><strong>Reply to:</strong> <a href="mailto:{email}" style="color:#7a5a2a;">{email}</a></td></tr>
          <tr><td style="border-top:1px solid #ede4d0;padding-top:18px;font-size:15px;line-height:1.7;color:#1f2a22;white-space:pre-wrap;">{safe_message}</td></tr>
          <tr><td style="padding-top:28px;font-size:12px;color:#9a8c70;font-style:italic;">Delivered via the butterflies of vennela.dev</td></tr>
        </table>
      </td></tr>
    </table>
    """


# ── Routes ───────────────────────────────────────────────
@api.get("/health")
async def health():
    return {"status": "ok"}


@api.post("/contact")
@limiter.limit("5/minute")
async def contact(request: Request, payload: ContactMessage):
    # honeypot
    if payload.company.strip():
        # silently accept to confuse bots
        return {"status": "ok"}

    params = {
        "from": f"Vennela's Garden <{SENDER_EMAIL}>",
        "to": [CONTACT_RECIPIENT],
        "reply_to": payload.email,
        "subject": f"✦ {payload.name} sent you a note",
        "html": build_email_html(payload.name, payload.email, payload.message),
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Email sent id=%s", result.get("id"))
        return {"status": "ok", "id": result.get("id")}
    except Exception as e:
        logger.exception("Failed to send contact email")
        raise HTTPException(status_code=502, detail="The butterflies got lost. Please try again in a moment.") from e


app.include_router(api)
