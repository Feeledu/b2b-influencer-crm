// AI Service for generating messages
// In a real app, this would call your backend API which calls OpenAI

export interface AIGenerationRequest {
  prompt: string;
  influencerName: string;
  platform: string;
  industry: string;
  context?: string;
}

export interface AIGenerationResponse {
  subject: string;
  message: string;
  suggestions?: string[];
}

export const generateAIMessage = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  try {
    // Call the real backend API
    const response = await fetch('/api/ai/generate-message', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      },
      body: JSON.stringify({
        prompt: request.prompt,
        influencer_name: request.influencerName,
        platform: request.platform,
        industry: request.industry,
        context: request.context
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI API:', error);
    
    // Fallback to template-based generation if API fails
    console.log('Falling back to template-based generation');
    return simulateAIResponse(request);
  }
};

const simulateAIResponse = (request: AIGenerationRequest): AIGenerationResponse => {
  const { prompt, influencerName, platform, industry } = request;
  
  // Analyze the prompt to determine the type of message
  const promptLower = prompt.toLowerCase();
  
  let messageType = 'partnership';
  if (promptLower.includes('collaboration') || promptLower.includes('content')) {
    messageType = 'collaboration';
  } else if (promptLower.includes('follow') || promptLower.includes('up')) {
    messageType = 'followup';
  } else if (promptLower.includes('event') || promptLower.includes('invite')) {
    messageType = 'event';
  }

  const responses = {
    partnership: {
      subject: `Partnership Opportunity - ${influencerName}`,
      message: `Hi ${influencerName},\n\nI hope this message finds you well. I've been following your excellent content on ${platform} and I'm particularly impressed by your insights on ${industry}.\n\n${prompt}\n\nI believe there's a great opportunity for us to collaborate and create something valuable for both our audiences. Your expertise in ${industry} would be a perfect complement to what we're building.\n\nWould you be interested in a brief call to discuss this further? I'd love to learn more about your current projects and see how we might work together.\n\nBest regards,\n[Your Name]`,
      suggestions: [
        "Mention specific content they've created that impressed you",
        "Include a clear call-to-action",
        "Keep it concise but personal"
      ]
    },
    collaboration: {
      subject: `Content Collaboration - ${influencerName}`,
      message: `Hi ${influencerName},\n\nI hope you're doing well. I've been following your work in ${industry} and I'm impressed by your expertise and unique perspective.\n\n${prompt}\n\nI'd love to explore how we might work together on content creation. This could include guest posts, joint webinars, social media collaborations, or other creative partnerships that would benefit both our audiences.\n\nWould you be open to a quick conversation to discuss the possibilities?\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`,
      suggestions: [
        "Be specific about the type of collaboration",
        "Mention mutual benefits",
        "Offer flexible options"
      ]
    },
    followup: {
      subject: `Following up - ${influencerName}`,
      message: `Hi ${influencerName},\n\nI hope this message finds you well. I wanted to follow up on our previous conversation about potential collaboration opportunities.\n\n${prompt}\n\nI understand you're busy, but I'd love to continue the discussion when you have a moment. Would you be available for a quick call this week?\n\nI'm excited about the possibilities we discussed and would love to move forward when you're ready.\n\nBest regards,\n[Your Name]`,
      suggestions: [
        "Reference the previous conversation",
        "Be respectful of their time",
        "Offer a specific next step"
      ]
    },
    event: {
      subject: `Invitation to Exclusive Event - ${influencerName}`,
      message: `Hi ${influencerName},\n\nI hope you're doing well. I wanted to personally invite you to an exclusive event for ${industry} professionals.\n\n${prompt}\n\nGiven your expertise and influence in ${industry}, I believe you would be a valuable addition to our community. The event will feature keynote speakers, networking opportunities, and panel discussions on the latest trends.\n\nWould you be interested in attending? I'd be happy to provide more details and answer any questions you might have.\n\nBest regards,\n[Your Name]`,
      suggestions: [
        "Highlight the exclusivity and value",
        "Mention specific benefits",
        "Make it easy to respond"
      ]
    }
  };

  return responses[messageType as keyof typeof responses] || responses.partnership;
};

// Real OpenAI integration would look like this:
export const generateAIMessageWithOpenAI = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  const systemPrompt = `You are a professional B2B outreach specialist. Generate a personalized email message for reaching out to an influencer.

Influencer Details:
- Name: ${request.influencerName}
- Platform: ${request.platform}
- Industry: ${request.industry}

User's Request: ${request.prompt}

Generate a professional, personalized email with:
1. A compelling subject line
2. A well-structured message that incorporates the user's request
3. Professional tone but personal touch
4. Clear call-to-action
5. Appropriate length (not too long, not too short)

Return the response as JSON with "subject" and "message" fields.`;

  // This would be the actual OpenAI API call:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
  */

  // For now, return the simulated response
  return simulateAIResponse(request);
};
