import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Target,
  X, 
  Edit, 
  Trash2, 
  Check,
  Plus,
  Upload
} from "lucide-react";
import { InteractionType, InteractionOutcome } from "@/lib/statusProgression";

interface InteractionTrackerProps {
  influencerId: string;
  interactions: InteractionType[];
  onAddInteraction: (interaction: Omit<InteractionType, 'id' | 'timestamp'>) => void;
  onUpdateInteraction: (id: string, updates: Partial<InteractionType>) => void;
  onDeleteInteraction: (id: string) => void;
}

const InteractionTracker: React.FC<InteractionTrackerProps> = ({
  influencerId,
  interactions,
  onAddInteraction,
  onUpdateInteraction,
  onDeleteInteraction,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newInteraction, setNewInteraction] = useState({
    type: 'email' as const,
    title: '',
    description: '',
    outcome: 'neutral' as const
  });

  const handleAddInteraction = () => {
    if (!newInteraction.title.trim()) {
      alert('Please enter a title for the interaction');
      return;
    }
    
    onAddInteraction(newInteraction);
    setNewInteraction({
      type: 'email',
      title: '',
      description: '',
      outcome: 'neutral'
    });
    setIsAdding(false);
  };

  const handleEditInteraction = (interaction: InteractionType) => {
    setEditingId(interaction.id);
  };

  const handleSaveEdit = (id: string, updates: Partial<InteractionType>) => {
    onUpdateInteraction(id, updates);
    setEditingId(null);
  };

  const handleDeleteInteraction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      onDeleteInteraction(id);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'content_collab': return <FileText className="h-4 w-4" />;
      case 'campaign': return <Target className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interaction History</h3>
        <Button onClick={() => setIsAdding(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Interaction
        </Button>
      </div>

      {/* Add New Interaction Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Add New Interaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newInteraction.type}
                  onValueChange={(value: any) => setNewInteraction(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="content_collab">Content Collaboration</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Outcome</label>
                <Select
                  value={newInteraction.outcome}
                  onValueChange={(value: any) => setNewInteraction(prev => ({ ...prev, outcome: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Brief title for this interaction"
                value={newInteraction.title}
                onChange={(e) => setNewInteraction(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Detailed description of the interaction"
                value={newInteraction.description}
                onChange={(e) => setNewInteraction(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddInteraction} size="sm">
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactions List */}
      <div className="space-y-3">
        {interactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No interactions yet</p>
            <p className="text-sm">Start building your relationship with the first interaction</p>
          </div>
        ) : (
          interactions
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((interaction) => (
              <Card key={interaction.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {getInteractionIcon(interaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{interaction.title}</h4>
                          <Badge className={getOutcomeColor(interaction.outcome)}>
                            {getOutcomeIcon(interaction.outcome)} {interaction.outcome}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{interaction.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{interaction.type}</span>
                          <span>•</span>
                          <span>{new Date(interaction.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(interaction.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditInteraction(interaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInteraction(interaction.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default InteractionTracker;