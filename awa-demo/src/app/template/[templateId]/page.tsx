import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { findTemplate, allTemplates } from '@/lib/mockData';
import { publicDb } from '@/lib/server/db/publicStore';
import { TemplateDetailClient } from './TemplateDetailClient';

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;

  // Locate template within mock catalog
  const match = findTemplate(templateId);
  if (!match) {
    notFound();
  }

  // Check subscription entitlement on the server via cookies (API-003, 07 §6.1, 08-API.md)
  const cookieStore = await cookies();
  const isSubscriberCookie = cookieStore.get('awa_subscribed')?.value === 'true';
  const roleCookie = cookieStore.get('awa_role')?.value;
  const isServerSubscribed = isSubscriberCookie || roleCookie === 'admin';

  // Resolve template guidance: check publicDb first, then catalog match
  const publicGuide = publicDb.getGuidanceForScope('template', templateId);
  const resolvedGuidance =
    publicGuide && !publicGuide.isInherited && publicGuide.steps.length > 0
      ? publicGuide.steps.map((s, idx) => ({
          step: s.position || idx + 1,
          title: s.title || `Step ${s.position || idx + 1}`,
          description: s.instruction,
          image: s.image_url || (s.media ? s.media.storage_reference : '') || `/images/guidance/${match.template.id}/step-${s.position || idx + 1}.svg`,
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : `Guidance step ${s.position || idx + 1}`),
          media_id: s.media_id || null,
          tip: s.tip || undefined,
          text: s.instruction,
          toolOrAction: (s as any).toolOrAction || (match.template.guidance[idx] as any)?.toolOrAction || undefined,
          expectedResult: (s as any).expectedResult || (match.template.guidance[idx] as any)?.expectedResult || undefined,
          actionText: (s as any).actionText || (match.template.guidance[idx] as any)?.actionText || undefined,
          actionUrl: (s as any).actionUrl || (match.template.guidance[idx] as any)?.actionUrl || undefined,
        }))
      : match.template.guidance;

  // Sanitize template data when not subscribed:
  // Base prompt text is protected, but template-specific guidance workflow steps are passed
  // so the connected-node flow can render template-specific steps (with guest lock overlay for step 3+)
  const template = {
    ...match.template,
    basePrompt: isServerSubscribed ? match.template.basePrompt : '',
    uiPrompt: isServerSubscribed ? match.template.uiPrompt : undefined,
    contextPrompt: isServerSubscribed ? match.template.contextPrompt : undefined,
    guidance: resolvedGuidance,
  };

  // Sanitize similar templates as well (no prompts or guidance leaked)
  const similarCandidates = allTemplates.filter((t) => t.id !== match.template.id);
  const sameMainCat = similarCandidates.filter((t) => t.mainCategory === match.template.mainCategory);
  const otherMainCat = similarCandidates.filter((t) => t.mainCategory !== match.template.mainCategory);
  const similarTemplates = [...sameMainCat, ...otherMainCat].slice(0, 4).map((t) => ({
    ...t,
    basePrompt: '',
    uiPrompt: undefined,
    contextPrompt: undefined,
    guidance: [],
  }));

  return (
    <TemplateDetailClient
      key={template.id}
      template={template}
      category={{
        id: match.category.id,
        name: match.category.name,
        description: match.category.description,
        subcategories: [],
      }}
      subcategory={{
        id: match.subcategory.id,
        name: match.subcategory.name,
        description: match.subcategory.description,
        templates: [],
      }}
      similarTemplates={similarTemplates}
      isServerSubscribed={isServerSubscribed}
    />
  );
}
