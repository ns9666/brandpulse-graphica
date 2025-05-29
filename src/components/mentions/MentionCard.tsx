
import React from 'react';
import { MessageSquare, Share, Heart, ExternalLink, MoreHorizontal, Eye, Calendar } from 'lucide-react';
import MotionCard from '@/components/ui/MotionCard';
import Chip from '@/components/ui/Chip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Mention {
  id: number;
  platform: string;
  author: string;
  authorImage?: string;
  date: string;
  content: string;
  postImage?: string;
  postUrl?: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
    views?: number;
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
      case 'youtube':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleViewPost = () => {
    if (mention.postUrl) {
      window.open(mention.postUrl, '_blank');
    }
  };

  return (
    <MotionCard className="hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={mention.authorImage} alt={mention.author} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {mention.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Chip variant="default" className={`${getPlatformColor(mention.platform)} text-xs px-2 py-1`}>
                  {mention.platform}
                </Chip>
                <span className="text-sm font-medium text-foreground truncate">{mention.author}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar size={10} />
                <span>{mention.date}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
            <MoreHorizontal size={12} />
          </Button>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-foreground bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border-l-4 border-brand-blue">
            {mention.content}
          </p>
          
          {/* Post Image - Compact size */}
          {mention.postImage && (
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <img 
                  src={mention.postImage} 
                  alt="Post content" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={handleViewPost}
                />
              </div>
              <div className="flex-1 flex items-center">
                <Button variant="outline" size="sm" onClick={handleViewPost} className="text-xs">
                  <ExternalLink size={12} className="mr-1" />
                  View Post
                </Button>
              </div>
            </div>
          )}
          
          {/* Engagement Stats with Tooltips */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                  <Heart size={14} />
                  <span className="font-medium text-xs">{mention.engagement.likes.toLocaleString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mention.engagement.likes.toLocaleString()} likes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                  <MessageSquare size={14} />
                  <span className="font-medium text-xs">{mention.engagement.replies}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mention.engagement.replies} replies</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
                  <Share size={14} />
                  <span className="font-medium text-xs">{mention.engagement.shares}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mention.engagement.shares} shares</p>
              </TooltipContent>
            </Tooltip>

            {mention.engagement.views && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 hover:text-purple-500 transition-colors cursor-pointer">
                    <Eye size={14} />
                    <span className="font-medium text-xs">{mention.engagement.views.toLocaleString()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mention.engagement.views.toLocaleString()} views</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-border mt-3">
          <div className="flex items-center gap-2">
            {getSentimentChip(mention.sentiment)}
          </div>
          
          <div className="flex gap-2">
            {!mention.postImage && (
              <Button variant="outline" size="sm" className="text-xs" onClick={handleViewPost}>
                <ExternalLink size={10} className="mr-1" />
                View Post
              </Button>
            )}
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
