'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CustomizationErrorType =
  | 'capacity_paused'
  | 'unusable_request'
  | 'out_of_credits'
  | 'service_unavailable'
  | null;

export interface ErrorDetails {
  type: CustomizationErrorType;
  title: string;
  message: string;
  noCreditUsed: boolean;
  actionText?: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: number;
  templateIds: string[];
}

export const ERROR_MESSAGES: Record<NonNullable<CustomizationErrorType>, ErrorDetails> = {
  capacity_paused: {
    type: 'capacity_paused',
    title: '503 Capacity Paused',
    message: 'Customization is temporarily paused. Try again shortly.',
    noCreditUsed: true,
  },
  unusable_request: {
    type: 'unusable_request',
    title: '422 Unusable Request',
    message: "Couldn't tell what to change — try naming the specific thing.",
    noCreditUsed: true,
  },
  out_of_credits: {
    type: 'out_of_credits',
    title: '402 Allowance Exhausted',
    message: "You're out of credits.",
    noCreditUsed: false,
    actionText: 'Buy credits →',
  },
  service_unavailable: {
    type: 'service_unavailable',
    title: '503 Service Unavailable',
    message: "Couldn't customize right now — no credit was used.",
    noCreditUsed: true,
    actionText: 'Retry',
  },
};

interface AppContextType {
  isSubscribed: boolean;
  credits: number;
  errorState: CustomizationErrorType;
  subscribe: () => void;
  unsubscribe: () => void;
  toggleSubscribed: () => void;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  customize: (basePrompt: string, query: string) => Promise<string>;
  clearError: () => void;
  triggerError: (type: CustomizationErrorType) => void;
  resetDemo: () => void;
  // Collections
  collections: Collection[];
  createCollection: (name: string, initialTemplateId?: string) => string;
  deleteCollection: (collectionId: string) => void;
  addTemplateToCollection: (collectionId: string, templateId: string) => void;
  removeTemplateFromCollection: (collectionId: string, templateId: string) => void;
  isTemplateSaved: (templateId: string) => boolean;
  getTemplateCollections: (templateId: string) => Collection[];
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  // Search & Navigation
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeSort: 'latest' | 'popular' | 'top_rated';
  setActiveSort: (s: 'latest' | 'popular' | 'top_rated') => void;
  viewToggle: 'prompts' | 'workflows';
  setViewToggle: (v: 'prompts' | 'workflows') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({
  children,
  initialSubscribed = true,
}: {
  children: ReactNode;
  initialSubscribed?: boolean;
}) => {
  // Default to subscribed for immediate testability, or respect initialSubscribed during SSR
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);

  // Sync isSubscribed and collections from localStorage on client mount
  React.useEffect(() => {
    try {
      const savedSub = localStorage.getItem('awa_subscribed');
      if (savedSub !== null) {
        setIsSubscribed(savedSub === 'true');
      }
      const savedCol = localStorage.getItem('awa_collections');
      if (savedCol) {
        setCollections(JSON.parse(savedCol));
      }
    } catch {}
  }, []);

  // Keep awa_subscribed cookie synchronized with state for server routes
  React.useEffect(() => {
    try {
      document.cookie = `awa_subscribed=${isSubscribed}; path=/; SameSite=Lax; max-age=2592000`;
    } catch {}
  }, [isSubscribed]);

  // Script 2:35 & 11-UI-UX P3: "This uses 1 credit. You have 8."
  const [credits, setCredits] = useState(8);
  const [errorState, setErrorState] = useState<CustomizationErrorType>(null);

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'col_demo_1',
      name: 'Client E-commerce Shoot',
      createdAt: 1711200000000,
      templateIds: ['tpl_1'],
    },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<'latest' | 'popular' | 'top_rated'>('latest');
  const [viewToggle, setViewToggle] = useState<'prompts' | 'workflows'>('prompts');

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  const saveCollectionsToStorage = (updated: Collection[]) => {
    setCollections(updated);
    try {
      localStorage.setItem('awa_collections', JSON.stringify(updated));
    } catch {
      // LocalStorage unavailable
    }
  };

  const createCollection = (name: string, initialTemplateId?: string): string => {
    const newId = 'col_' + Date.now();
    const newCol: Collection = {
      id: newId,
      name: name.trim() || 'Untitled Collection',
      createdAt: Date.now(),
      templateIds: initialTemplateId ? [initialTemplateId] : [],
    };
    const updated = [...collections, newCol];
    saveCollectionsToStorage(updated);
    return newId;
  };

  const deleteCollection = (collectionId: string) => {
    const updated = collections.filter(c => c.id !== collectionId);
    saveCollectionsToStorage(updated);
  };

  const addTemplateToCollection = (collectionId: string, templateId: string) => {
    const updated = collections.map(col => {
      if (col.id === collectionId) {
        if (!col.templateIds.includes(templateId)) {
          return { ...col, templateIds: [...col.templateIds, templateId] };
        }
      }
      return col;
    });
    saveCollectionsToStorage(updated);
  };

  const removeTemplateFromCollection = (collectionId: string, templateId: string) => {
    const updated = collections.map(col => {
      if (col.id === collectionId) {
        return { ...col, templateIds: col.templateIds.filter(id => id !== templateId) };
      }
      return col;
    });
    saveCollectionsToStorage(updated);
  };

  const isTemplateSaved = (templateId: string): boolean => {
    return collections.some(col => col.templateIds.includes(templateId));
  };

  const getTemplateCollections = (templateId: string): Collection[] => {
    return collections.filter(col => col.templateIds.includes(templateId));
  };

  const subscribe = () => {
    setIsSubscribed(true);
    setCredits(8);
    setErrorState(null);
    try {
      localStorage.setItem('awa_subscribed', 'true');
    } catch {}
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
    setErrorState(null);
    try {
      localStorage.setItem('awa_subscribed', 'false');
    } catch {}
  };

  const toggleSubscribed = () => {
    setIsSubscribed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('awa_subscribed', String(next));
      } catch {}
      return next;
    });
    setErrorState(null);
  };

  const clearError = () => {
    setErrorState(null);
  };

  const triggerError = (type: CustomizationErrorType) => {
    setErrorState(type);
  };

  const resetDemo = () => {
    setIsSubscribed(false);
    setCredits(8);
    setErrorState(null);
  };

  const customize = async (basePrompt: string, query: string): Promise<string> => {
    setErrorState(null);

    // Realistic simulated delay: 2.6 to 3.2 seconds
    // Allows the speaker to say: "That's the only place AI runs inside our product..."
    const delay = Math.floor(Math.random() * 600) + 2600;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const lowerQuery = query.toLowerCase().trim();

    // Trigger test phrases for manual error simulation during live demo
    if (lowerQuery.includes('fail: paused') || lowerQuery === 'pause') {
      setErrorState('capacity_paused');
      throw new Error('capacity_paused');
    }

    if (lowerQuery.includes('fail: unusable') || lowerQuery.includes('make it better') || lowerQuery === 'change') {
      setErrorState('unusable_request');
      throw new Error('unusable_request');
    }

    if (lowerQuery.includes('fail: credits') || credits <= 0) {
      setErrorState('out_of_credits');
      throw new Error('out_of_credits');
    }

    if (lowerQuery.includes('fail: error')) {
      setErrorState('service_unavailable');
      throw new Error('service_unavailable');
    }

    // Deduct 1 credit
    setCredits((prev) => Math.max(0, prev - 1));

    // Intelligent prompt reworking based on script instructions:
    // Script 2:35: "Make it a leather wallet, vertical for a phone listing."
    // Script 3:00: "Every technical detail kept. Only what I asked for changed."
    let rewritten = basePrompt;

    const isWallet = lowerQuery.includes('wallet') || lowerQuery.includes('leather');
    const isVertical = lowerQuery.includes('vertical') || lowerQuery.includes('phone') || lowerQuery.includes('mobile') || lowerQuery.includes('9:16');

    if (isWallet) {
      // Replace the subject seamlessly while preserving all studio parameters
      rewritten = rewritten.replace(
        'generic unbranded cylindrical ceramic tumbler',
        'handcrafted full-grain Italian leather bifold wallet with subtle burnished edges and visible saddle stitching'
      );
      rewritten = rewritten.replace(
        'generic unbranded object',
        'handcrafted full-grain Italian leather bifold wallet with subtle burnished edges and visible saddle stitching'
      );
      rewritten = rewritten.replace(
        'consumer lifestyle product',
        'handcrafted full-grain Italian leather bifold wallet'
      );
      rewritten = rewritten.replace(
        'artisanal accessory',
        'handcrafted full-grain Italian leather bifold wallet'
      );

      // Enhance lighting to highlight leather texture
      if (rewritten.includes('Three-point softbox setup —')) {
        rewritten = rewritten.replace(
          'key light at 45-degrees camera left through a 120cm octabox,',
          'key light at 45-degrees camera left through a 120cm octabox accentuating natural leather grain and subtle patina,'
        );
      }
    }

    if (isVertical) {
      // Update aspect ratio parameter
      rewritten = rewritten.replace('--ar 1:1', '--ar 9:16');
      rewritten = rewritten.replace('--ar 4:5', '--ar 9:16');
      rewritten = rewritten.replace('--ar 16:9', '--ar 9:16');

      // Add vertical framing instruction in camera & optics section
      if (rewritten.includes('Camera & Optics:')) {
        rewritten = rewritten.replace(
          'crisp contact shadow directly beneath product.',
          'crisp contact shadow directly beneath product. Vertical 9:16 orientation framed specifically for mobile e-commerce listing hero imagery.'
        );
      }
    }

    // If the input was something else custom (e.g. "make it ceramic matte black mug")
    if (!isWallet && !isVertical) {
      // Keep technical integrity, intelligently adapt subject
      rewritten = rewritten.replace(
        'generic unbranded cylindrical ceramic tumbler',
        `${query.replace(/^make it\s+/i, '')}`
      );
      // If no direct replacement occurred, append gracefully
      if (rewritten === basePrompt) {
        rewritten = rewritten.replace(
          'Parameters:',
          `Modifications: Configured specifically for ${query}.\n\nParameters:`
        );
      }
    }

    return rewritten;
  };

  return (
    <AppContext.Provider
      value={{
        isSubscribed,
        credits,
        errorState,
        subscribe,
        unsubscribe,
        toggleSubscribed,
        setCredits,
        customize,
        clearError,
        triggerError,
        resetDemo,
        collections,
        createCollection,
        deleteCollection,
        addTemplateToCollection,
        removeTemplateFromCollection,
        isTemplateSaved,
        getTemplateCollections,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        searchQuery,
        setSearchQuery,
        activeSort,
        setActiveSort,
        viewToggle,
        setViewToggle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
