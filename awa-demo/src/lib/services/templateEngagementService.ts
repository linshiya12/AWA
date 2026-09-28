/**
 * Template Engagement Service
 * 
 * Provides an abstracted service layer for querying, filtering, sorting,
 * and paginating template engagement metrics (likes, saves, total engagement).
 * 
 * Architecture:
 * UI -> templateEngagementService -> mockEngagementData
 * (Later swappable to real Analytics API without UI changes)
 */

import {
  MOCK_ENGAGEMENT_DATA,
  RawTemplateEngagement,
} from '@/lib/data/mockEngagementData';

export type DateRangeOption =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | 'thisYear'
  | 'allTime';

export type SortOption = 'likes' | 'saves' | 'engagement' | 'recent';

export interface TemplateEngagementItem {
  templateId: string;
  templateName: string;
  category: string;
  mainCategory: 'Image' | 'Video' | 'Slides' | 'Websites';
  status: 'published' | 'draft' | 'archived';
  likes: number;
  saves: number;
  totalEngagement: number;
  collections: string[];
  createdAt: string;
  updatedAt: string;
  // Metric context
  likeSaveRatio: number | null;
}

export interface EngagementSummary {
  totalLikes: number;
  totalSaves: number;
  totalEngagement: number;
  likedTemplatesCount: number;
  savedTemplatesCount: number;
  totalTemplates: number;
  dateRange: DateRangeOption;
}

export interface EngagementFilterParams {
  search?: string;
  category?: string;
  dateRange?: DateRangeOption;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedEngagementResult {
  items: TemplateEngagementItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Extracts the metrics appropriate for the selected date range.
 */
function resolveEngagementMetrics(
  raw: RawTemplateEngagement,
  dateRange: DateRangeOption = 'allTime'
): { likes: number; saves: number } {
  switch (dateRange) {
    case 'today':
      return { likes: raw.todayLikes, saves: raw.todaySaves };
    case '7d':
      return { likes: raw.sevenDaysLikes, saves: raw.sevenDaysSaves };
    case '30d':
      return { likes: raw.thirtyDaysLikes, saves: raw.thirtyDaysSaves };
    case '90d':
      return { likes: raw.ninetyDaysLikes, saves: raw.ninetyDaysSaves };
    case 'thisYear':
      return { likes: raw.thisYearLikes, saves: raw.thisYearSaves };
    case 'allTime':
    default:
      return { likes: raw.likes, saves: raw.saves };
  }
}

/**
 * Transforms raw mock data into standard TemplateEngagementItem
 */
function toEngagementItem(
  raw: RawTemplateEngagement,
  dateRange: DateRangeOption = 'allTime'
): TemplateEngagementItem {
  const { likes, saves } = resolveEngagementMetrics(raw, dateRange);
  const totalEngagement = likes + saves;
  const likeSaveRatio = saves > 0 ? Number((likes / saves).toFixed(2)) : null;

  return {
    templateId: raw.templateId,
    templateName: raw.templateName,
    category: raw.category,
    mainCategory: raw.mainCategory,
    status: raw.status,
    likes,
    saves,
    totalEngagement,
    collections: raw.collections || [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    likeSaveRatio,
  };
}

class TemplateEngagementService {
  /**
   * Returns aggregated high-level summary cards data based on the chosen date range.
   */
  async getEngagementSummary(dateRange: DateRangeOption = 'allTime'): Promise<EngagementSummary> {
    // Simulate minimal asynchronous delay to match API behavior
    await new Promise((resolve) => setTimeout(resolve, 80));

    let totalLikes = 0;
    let totalSaves = 0;
    let likedTemplatesCount = 0;
    let savedTemplatesCount = 0;

    for (const raw of MOCK_ENGAGEMENT_DATA) {
      const { likes, saves } = resolveEngagementMetrics(raw, dateRange);
      totalLikes += likes;
      totalSaves += saves;
      if (likes > 0) likedTemplatesCount++;
      if (saves > 0) savedTemplatesCount++;
    }

    return {
      totalLikes,
      totalSaves,
      totalEngagement: totalLikes + totalSaves,
      likedTemplatesCount,
      savedTemplatesCount,
      totalTemplates: MOCK_ENGAGEMENT_DATA.length,
      dateRange,
    };
  }

  /**
   * Retrieves paginated, sorted, and filtered template engagement data.
   */
  async getTemplateEngagement(
    params: EngagementFilterParams = {}
  ): Promise<PaginatedEngagementResult> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const {
      search = '',
      category = 'all',
      dateRange = 'allTime',
      sortBy = 'likes',
      page = 1,
      pageSize = 10,
    } = params;

    // Map to items with metrics resolved to date range
    let items = MOCK_ENGAGEMENT_DATA.map((raw) => toEngagementItem(raw, dateRange));

    // 1. Filter by Search (Template name or category)
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.templateName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.mainCategory.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Category
    if (category && category !== 'all') {
      items = items.filter(
        (item) =>
          item.category.toLowerCase() === category.toLowerCase() ||
          item.mainCategory.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'saves':
          return b.saves - a.saves;
        case 'engagement':
          return b.totalEngagement - a.totalEngagement;
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return b.likes - a.likes;
      }
    });

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validatedPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (validatedPage - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: validatedPage,
      pageSize,
    };
  }

  /**
   * Retrieves top N most liked templates for the quick tab view.
   */
  async getMostLikedTemplates(
    limit: number = 10,
    dateRange: DateRangeOption = 'allTime'
  ): Promise<TemplateEngagementItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const items = MOCK_ENGAGEMENT_DATA.map((raw) => toEngagementItem(raw, dateRange));
    items.sort((a, b) => b.likes - a.likes);
    return items.slice(0, limit);
  }

  /**
   * Retrieves top N most saved templates for the quick tab view.
   */
  async getMostSavedTemplates(
    limit: number = 10,
    dateRange: DateRangeOption = 'allTime'
  ): Promise<TemplateEngagementItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const items = MOCK_ENGAGEMENT_DATA.map((raw) => toEngagementItem(raw, dateRange));
    items.sort((a, b) => b.saves - a.saves);
    return items.slice(0, limit);
  }

  /**
   * Retrieves a single template's engagement details by templateId.
   */
  async getTemplateEngagementById(
    templateId: string,
    dateRange: DateRangeOption = 'allTime'
  ): Promise<TemplateEngagementItem | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const raw = MOCK_ENGAGEMENT_DATA.find((t) => t.templateId === templateId);
    if (!raw) return null;

    return toEngagementItem(raw, dateRange);
  }

  /**
   * Returns unique category names found across all templates.
   */
  async getCategories(): Promise<{ name: string; count: number }[]> {
    const categoryCounts: Record<string, number> = {};

    for (const raw of MOCK_ENGAGEMENT_DATA) {
      categoryCounts[raw.category] = (categoryCounts[raw.category] || 0) + 1;
    }

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Prepares CSV content for export of aggregate engagement data.
   * Adheres strictly to privacy rules: exports ONLY aggregate template metrics.
   */
  async generateExportCsv(
    dateRange: DateRangeOption = 'allTime',
    category?: string
  ): Promise<string> {
    const res = await this.getTemplateEngagement({
      dateRange,
      category,
      pageSize: 1000,
    });

    const headers = ['Template Name', 'Category', 'Likes', 'Saves', 'Total Engagement', 'Last Updated'];
    const rows = res.items.map((item) => [
      `"${item.templateName.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      item.likes,
      item.saves,
      item.totalEngagement,
      `"${new Date(item.updatedAt).toISOString().split('T')[0]}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const templateEngagementService = new TemplateEngagementService();
