from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from typing import Optional

# Make OpenAI import optional
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI not available. AI features will use fallback templates.")

router = APIRouter()

class AIGenerationRequest(BaseModel):
    prompt: str
    influencer_name: str
    platform: str
    industry: str
    context: Optional[str] = None

class AIGenerationResponse(BaseModel):
    subject: str
    message: str
    suggestions: Optional[list[str]] = None

@router.post("/generate-message", response_model=AIGenerationResponse)
async def generate_message(request: AIGenerationRequest):
    try:
        # Check if OpenAI is available
        if not OPENAI_AVAILABLE:
            # Use fallback method
            return await generate_message_fallback(request)
        
        # Initialize OpenAI client
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        if not openai.api_key:
            # Use fallback method if no API key
            return await generate_message_fallback(request)
        
        # Create a sophisticated prompt for the AI
        system_prompt = f"""You are a professional B2B outreach specialist with expertise in influencer marketing and partnership development. 

Generate a personalized, professional email message for reaching out to an influencer with the following details:

Influencer Information:
- Name: {request.influencer_name}
- Platform: {request.platform}
- Industry: {request.industry}
- Context: {request.context or 'No additional context provided'}

User's Request: {request.prompt}

Requirements:
1. Write a compelling, personalized subject line (max 60 characters)
2. Create a professional but warm email message that incorporates the user's specific request
3. Use a conversational yet professional tone
4. Include specific details about the influencer's platform and industry
5. Make it personal and authentic - avoid generic templates
6. Include a clear, specific call-to-action
7. Keep the message concise but comprehensive (150-300 words)
8. End with a professional signature placeholder

Return your response as JSON with these fields:
- subject: the email subject line
- message: the email body
- suggestions: 2-3 tips for improving the message

Make sure the message feels personal and tailored to this specific influencer, not like a template."""

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate a message for: {request.prompt}"}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        # Parse the AI response
        ai_content = response.choices[0].message.content
        
        # Try to parse as JSON, fallback to structured parsing
        try:
            import json
            result = json.loads(ai_content)
            return AIGenerationResponse(
                subject=result.get("subject", ""),
                message=result.get("message", ""),
                suggestions=result.get("suggestions", [])
            )
        except json.JSONDecodeError:
            # Fallback: parse the response manually
            lines = ai_content.split('\n')
            subject = ""
            message = ""
            suggestions = []
            
            current_section = None
            for line in lines:
                line = line.strip()
                if line.startswith('"subject"') or line.startswith('subject:'):
                    subject = line.split(':', 1)[1].strip().strip('"')
                elif line.startswith('"message"') or line.startswith('message:'):
                    current_section = 'message'
                elif current_section == 'message' and line and not line.startswith('"'):
                    message += line + '\n'
                elif line.startswith('"suggestions"') or line.startswith('suggestions:'):
                    current_section = 'suggestions'
                elif current_section == 'suggestions' and line.startswith('-'):
                    suggestions.append(line[1:].strip())
            
            return AIGenerationResponse(
                subject=subject or f"Partnership Opportunity - {request.influencer_name}",
                message=message or ai_content,
                suggestions=suggestions
            )
            
    except Exception as e:
        print(f"Error calling OpenAI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate AI message: {str(e)}")

# Fallback endpoint for when OpenAI is not available
@router.post("/generate-message-fallback", response_model=AIGenerationResponse)
async def generate_message_fallback(request: AIGenerationRequest):
    """Fallback method using template-based generation when OpenAI is not available"""
    
    # Enhanced template-based generation
    prompt_lower = request.prompt.lower()
    
    if "collaboration" in prompt_lower or "content" in prompt_lower:
        message_type = "collaboration"
    elif "follow" in prompt_lower or "up" in prompt_lower:
        message_type = "followup"
    elif "event" in prompt_lower or "invite" in prompt_lower:
        message_type = "event"
    else:
        message_type = "partnership"
    
    templates = {
        "partnership": {
            "subject": f"Partnership Opportunity - {request.influencer_name}",
            "message": f"""Hi {request.influencer_name},

I hope this message finds you well. I've been following your excellent content on {request.platform} and I'm particularly impressed by your insights on {request.industry}.

{request.prompt}

I believe there's a great opportunity for us to collaborate and create something valuable for both our audiences. Your expertise in {request.industry} would be a perfect complement to what we're building.

Would you be interested in a brief call to discuss this further? I'd love to learn more about your current projects and see how we might work together.

Best regards,
[Your Name]""",
            "suggestions": [
                "Mention specific content they've created that impressed you",
                "Include a clear call-to-action",
                "Keep it concise but personal"
            ]
        },
        "collaboration": {
            "subject": f"Content Collaboration - {request.influencer_name}",
            "message": f"""Hi {request.influencer_name},

I hope you're doing well. I've been following your work in {request.industry} and I'm impressed by your expertise and unique perspective.

{request.prompt}

I'd love to explore how we might work together on content creation. This could include guest posts, joint webinars, social media collaborations, or other creative partnerships that would benefit both our audiences.

Would you be open to a quick conversation to discuss the possibilities?

Looking forward to hearing from you.

Best regards,
[Your Name]""",
            "suggestions": [
                "Be specific about the type of collaboration",
                "Mention mutual benefits",
                "Offer flexible options"
            ]
        }
    }
    
    template = templates.get(message_type, templates["partnership"])
    
    return AIGenerationResponse(
        subject=template["subject"],
        message=template["message"],
        suggestions=template["suggestions"]
    )
