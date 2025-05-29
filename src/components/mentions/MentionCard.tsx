
import React from 'react';
import { MessageSquare, Share, ThumbsUp, ExternalLink, MoreHorizontal } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { Button } from '@/components/ui/button';

interface Mention {
  id: number;
  platform: string;
  author: string;
  date: string;
  content: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface MentionCardProps {
  mention: Mention;
}

const MentionCard = ({ mention }: MentionCardProps) => {
  const getSentimentChip = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return <Chip variant="success">Positive</Chip>;
      case 'negative':
        return <Chip variant="danger">Negative</Chip>;
      default:
        return <Chip variant="neutral">Neutral</Chip>;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'instagram':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'facebook':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'reddit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'linkedin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <MotionCard className="p-5 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Chip variant="default" className={getPlatformColor(mention.platform)}>
              {mention.platform}
            </Chip>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-foreground">{mention.author}</span>
              <span className="text-xs text-muted-foreground">{mention.date}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={14} />
          </Button>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base leading-relaxed text-foreground">
            {mention.content}
          </p>
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
              <ThumbsUp size={14} />
              <span>{mention.engagement.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
              <MessageSquare size={14} />
              <span>{mention.engagement.replies}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
              <Share size={14} />
              <span>{mention.engagement.shares}</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {getSentimentChip(mention.sentiment)}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink size={12} className="mr-1" />
              View Post
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Analyze
            </Button>
            <Button variant="default" size="sm" className="text-xs bg-brand-blue hover:bg-brand-blue/90">
              Respond
            </Button>
          </div>
        </div>
      </div>
    </MotionCard>
  );
};

export default MentionCard;
