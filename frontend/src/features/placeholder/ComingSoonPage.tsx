import React from 'react';
import { PageTransition } from '../../components/ui/PageTransition';
import { EmptyState } from '../../components/ui/EmptyState';
import { Construction } from 'lucide-react';

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">This feature is currently under development</p>
        </div>
      </div>
      
      <EmptyState
        icon={<Construction size={32} />}
        title="Coming Soon"
        description={`We're working hard to bring you the new ${title} experience. Stay tuned!`}
      />
    </PageTransition>
  );
};

export default ComingSoonPage;
