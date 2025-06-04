
import React, { useState } from 'react';
import { MentionData } from '@/services/djangoApi';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedMentionCardProps {
  mention: MentionData;
}

const EnhancedMentionCard = ({ mention }: EnhancedMentionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const shouldTruncate = mention.content.length > maxLength;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'instagram':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'facebook':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'reddit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const displayContent = shouldTruncate && !isExpanded 
    ? `${mention.content.slice(0, maxLength)}...`
    : mention.content;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={mention.authorImage || '/placeholder.svg'}
            alt={mention.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">
              {mention.author}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mention.date}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getPlatformColor(mention.platform)}>
            {mention.platform}
          </Badge>
          <Badge className={getSentimentColor(mention.sentiment)}>
            {mention.sentiment}
          </Badge>
        </div>
      </div>

      {/* Content with truncation */}
      <div className="mb-4">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {displayContent}
        </p>
        {shouldTruncate && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-brand-blue hover:text-brand-blue/80 p-0 h-auto font-normal"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                View Less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                View More
              </>
            )}
          </Button>
        )}
      </div>

      {/* Post Image */}
      {mention.postImage && (
        <div className="mb-4">
          <img
            src={mention.postImage}
            alt="Post content"
            className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mb-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span>{mention.engagement.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{mention.engagement.replies.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share size={16} />
            <span>{mention.engagement.shares.toLocaleString()}</span>
          </div>
          {mention.engagement.views && (
            <div className="flex items-center gap-1">
              <span>{mention.engagement.views.toLocaleString()} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        {mention.postUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={mention.postUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} className="mr-2" />
              View Original
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedMentionCard;
