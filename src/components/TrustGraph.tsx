import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Shield, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Search,
  Filter,
  Network
} from 'lucide-react';

interface TrustGraphProps {
  data: {
    nodes: Array<{
      id: string;
      type: 'influencer' | 'customer' | 'company';
      name: string;
      platform?: string;
      followers?: number;
      company?: string;
      trust_score?: number;
      relationship_strength?: number;
    }>;
    edges: Array<{
      source: string;
      target: string;
      relationship_type: string;
      platform: string;
      strength: number;
    }>;
  };
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

const TrustGraph: React.FC<TrustGraphProps> = ({ 
  data, 
  onNodeClick, 
  onEdgeClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mock data for demonstration
  const mockData = {
    nodes: [
      {
        id: 'influencer_1',
        type: 'influencer',
        name: 'John Doe',
        platform: 'LinkedIn',
        followers: 15000,
        trust_score: 0.85
      },
      {
        id: 'customer_1',
        type: 'customer',
        name: 'Jane Smith',
        company: 'TechCorp',
        relationship_strength: 0.92
      },
      {
        id: 'customer_2',
        type: 'customer',
        name: 'Mike Johnson',
        company: 'StartupXYZ',
        relationship_strength: 0.78
      },
      {
        id: 'customer_3',
        type: 'customer',
        name: 'Sarah Wilson',
        company: 'InnovateLab',
        relationship_strength: 0.65
      },
      {
        id: 'influencer_2',
        type: 'influencer',
        name: 'Alex Chen',
        platform: 'Twitter',
        followers: 8500,
        trust_score: 0.72
      }
    ],
    edges: [
      {
        source: 'influencer_1',
        target: 'customer_1',
        relationship_type: 'follows',
        platform: 'LinkedIn',
        strength: 0.92
      },
      {
        source: 'influencer_1',
        target: 'customer_2',
        relationship_type: 'engages',
        platform: 'LinkedIn',
        strength: 0.78
      },
      {
        source: 'influencer_1',
        target: 'customer_3',
        relationship_type: 'interacts',
        platform: 'LinkedIn',
        strength: 0.65
      },
      {
        source: 'influencer_2',
        target: 'customer_1',
        relationship_type: 'follows',
        platform: 'Twitter',
        strength: 0.58
      }
    ]
  };

  const graphData = data || mockData;

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case 'influencer':
        return '#8B5CF6'; // Purple
      case 'customer':
        return '#10B981'; // Green
      case 'company':
        return '#F59E0B'; // Orange
      default:
        return '#6B7280'; // Gray
    }
  };

  const getNodeSize = (node: any) => {
    const baseSize = 20;
    if (node.followers) {
      return Math.min(baseSize + (node.followers / 1000), 60);
    }
    if (node.trust_score) {
      return baseSize + (node.trust_score * 30);
    }
    return baseSize;
  };

  const getEdgeColor = (edge: any) => {
    const alpha = edge.strength;
    return `rgba(59, 130, 246, ${alpha})`; // Blue with transparency
  };

  const getEdgeWidth = (edge: any) => {
    return Math.max(1, edge.strength * 5);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw edges
    graphData.edges.forEach((edge) => {
      const sourceNode = graphData.nodes.find(n => n.id === edge.source);
      const targetNode = graphData.nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      const x1 = sourceNode.x || 100;
      const y1 = sourceNode.y || 100;
      const x2 = targetNode.x || 200;
      const y2 = targetNode.y || 200;

      ctx.strokeStyle = getEdgeColor(edge);
      ctx.lineWidth = getEdgeWidth(edge);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw edge label
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(edge.relationship_type, midX, midY - 5);
    });

    // Draw nodes
    graphData.nodes.forEach((node) => {
      const x = node.x || 100;
      const y = node.y || 100;
      const size = getNodeSize(node);
      const color = getNodeColor(node);

      // Node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = selectedNode === node.id ? '#EF4444' : '#FFFFFF';
      ctx.lineWidth = selectedNode === node.id ? 3 : 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y + 4);

      // Node type badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x - 20, y - size - 15, 40, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.fillText(node.type.toUpperCase(), x, y - size - 5);
    });

    ctx.restore();
  };

  useEffect(() => {
    drawGraph();
  }, [graphData, zoom, pan, selectedNode, selectedEdge]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom - pan.x;
    const y = (event.clientY - rect.top) / zoom - pan.y;

    // Check if clicked on a node
    const clickedNode = graphData.nodes.find(node => {
      const nodeX = node.x || 100;
      const nodeY = node.y || 100;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      return distance <= getNodeSize(node);
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
      onNodeClick?.(clickedNode.id);
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold">Trust Graph</h3>
              <p className="text-sm text-muted-foreground">
                Visualize influencer-customer relationships and trust connections
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Influencers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Companies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-500 rounded"></div>
            <span>Connection Strength</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative border border-border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Node</h4>
            {(() => {
              const node = graphData.nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              return (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getNodeColor(node) }}
                    ></div>
                    <span className="font-medium">{node.name}</span>
                    <Badge variant="outline">{node.type}</Badge>
                  </div>
                  {node.platform && (
                    <p className="text-sm text-muted-foreground">
                      Platform: {node.platform}
                    </p>
                  )}
                  {node.followers && (
                    <p className="text-sm text-muted-foreground">
                      Followers: {node.followers.toLocaleString()}
                    </p>
                  )}
                  {node.trust_score && (
                    <p className="text-sm text-muted-foreground">
                      Trust Score: {Math.round(node.trust_score * 100)}%
                    </p>
                  )}
                  {node.company && (
                    <p className="text-sm text-muted-foreground">
                      Company: {node.company}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {graphData.nodes.filter(n => n.type === 'influencer').length}
            </div>
            <div className="text-sm text-muted-foreground">Influencers</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {graphData.nodes.filter(n => n.type === 'customer').length}
            </div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-warning">
              {graphData.edges.length}
            </div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrustGraph;
