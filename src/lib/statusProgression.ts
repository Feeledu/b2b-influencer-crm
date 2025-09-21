// Enhanced CRM Status Progression System
export type InfluencerStatus = 'saved' | 'contacted' | 'warm' | 'cold' | 'partnered';

export interface StatusTransition {
  from: InfluencerStatus;
  to: InfluencerStatus;
  trigger: string;
  description: string;
  suggested: boolean;
  requirements?: string[];
}

export interface InteractionType {
  id: string;
  type: 'email' | 'meeting' | 'call' | 'content_collab' | 'campaign' | 'note';
  title: string;
  description: string;
  timestamp: string;
  outcome?: 'positive' | 'neutral' | 'negative';
  nextAction?: string;
  fileUrl?: string;
}

export interface StatusProgression {
  currentStatus: InfluencerStatus;
  nextSuggestedStatus?: InfluencerStatus;
  progressionReason?: string;
  interactions: InteractionType[];
  lastInteraction?: InteractionType;
  relationshipStrength: number;
  daysSinceLastContact: number;
}

// Status progression rules
export const STATUS_TRANSITIONS: StatusTransition[] = [
  {
    from: 'saved',
    to: 'contacted',
    trigger: 'First outreach sent',
    description: 'Send initial email or message',
    suggested: true,
    requirements: ['Email sent', 'Message delivered']
  },
  {
    from: 'contacted',
    to: 'warm',
    trigger: 'Positive response received',
    description: 'Influencer responded positively to outreach',
    suggested: true,
    requirements: ['Response received', 'Positive sentiment']
  },
  {
    from: 'warm',
    to: 'partnered',
    trigger: 'Partnership established',
    description: 'Formal partnership or collaboration agreement',
    suggested: true,
    requirements: ['Partnership agreement', 'Collaboration confirmed']
  },
  {
    from: 'contacted',
    to: 'cold',
    trigger: 'No response or negative response',
    description: 'Influencer not responding or declined',
    suggested: false,
    requirements: ['No response after 2 weeks', 'Negative response']
  },
  {
    from: 'warm',
    to: 'cold',
    trigger: 'Relationship cooled down',
    description: 'Influencer became unresponsive or lost interest',
    suggested: false,
    requirements: ['No response after 1 month', 'Lost interest']
  }
];

export const STATUS_CONFIG: Record<InfluencerStatus, { 
  label: string; 
  color: string; 
  icon: string; 
  description: string;
  bgColor: string;
  textColor: string;
}> = {
  saved: {
    label: 'Saved',
    color: 'blue',
    icon: 'bookmark',
    description: 'Influencer saved to your list',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  contacted: {
    label: 'Contacted',
    color: 'yellow',
    icon: 'mail',
    description: 'Initial outreach sent',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  warm: {
    label: 'Warm',
    color: 'orange',
    icon: 'heart',
    description: 'Positive response received',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  cold: {
    label: 'Cold',
    color: 'gray',
    icon: 'snowflake',
    description: 'No response or declined',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  partnered: {
    label: 'Partnered',
    color: 'green',
    icon: 'handshake',
    description: 'Partnership established',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  }
};

export function getStatusProgression(
  currentStatus: InfluencerStatus,
  interactions: InteractionType[],
  lastContactDate?: string
): StatusProgression {
  const lastInteraction = interactions[interactions.length - 1];
  const daysSinceLastContact = lastContactDate 
    ? Math.floor((Date.now() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Calculate relationship strength based on interactions
  const relationshipStrength = calculateRelationshipStrength(interactions);

  // Find suggested next status
  const possibleTransitions = STATUS_TRANSITIONS.filter(t => t.from === currentStatus);
  const suggestedTransition = possibleTransitions.find(t => 
    checkTransitionRequirements(t, interactions, daysSinceLastContact)
  );

  return {
    currentStatus,
    nextSuggestedStatus: suggestedTransition?.to,
    progressionReason: suggestedTransition?.description,
    interactions,
    lastInteraction,
    relationshipStrength,
    daysSinceLastContact
  };
}

function calculateRelationshipStrength(interactions: InteractionType[]): number {
  if (interactions.length === 0) return 0;
  
  let strength = 0;
  const weights = {
    email: 5,
    meeting: 20,
    call: 15,
    content_collab: 25,
    campaign: 30,
    note: 2
  };

  interactions.forEach(interaction => {
    const weight = weights[interaction.type] || 0;
    const outcomeMultiplier = interaction.outcome === 'positive' ? 1.2 : 
                             interaction.outcome === 'negative' ? 0.5 : 1;
    strength += weight * outcomeMultiplier;
  });

  return Math.min(Math.round(strength), 100);
}

function checkTransitionRequirements(
  transition: StatusTransition,
  interactions: InteractionType[],
  daysSinceLastContact: number
): boolean {
  if (!transition.requirements) return true;

  // For basic transitions, be more lenient
  if (transition.from === 'saved' && transition.to === 'contacted') {
    return true; // Always suggest contacting
  }
  
  if (transition.from === 'contacted' && transition.to === 'warm') {
    return interactions.some(i => i.outcome === 'positive') || daysSinceLastContact > 3;
  }
  
  if (transition.from === 'warm' && transition.to === 'partnered') {
    return interactions.some(i => i.type === 'content_collab' || i.type === 'campaign');
  }
  
  if (transition.from === 'contacted' && transition.to === 'cold') {
    return daysSinceLastContact > 14 || interactions.some(i => i.outcome === 'negative');
  }
  
  if (transition.from === 'warm' && transition.to === 'cold') {
    return daysSinceLastContact > 30;
  }

  return false;
}

export function getStatusSuggestions(progression: StatusProgression): string[] {
  const suggestions: string[] = [];
  
  if (progression.nextSuggestedStatus) {
    const nextStatus = STATUS_CONFIG[progression.nextSuggestedStatus];
    suggestions.push(`Next step: ${nextStatus.description}`);
  }
  
  if (progression.relationshipStrength < 30) {
    suggestions.push('Consider more frequent interactions to strengthen the relationship');
  }
  
  if (progression.daysSinceLastContact > 7) {
    suggestions.push('Time for a follow-up - relationships need regular nurturing');
  }
  
  if (progression.interactions.length === 0) {
    suggestions.push('Start building the relationship with your first interaction');
  }
  
  return suggestions;
}