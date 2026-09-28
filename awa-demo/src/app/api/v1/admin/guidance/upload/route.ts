import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Supported MIME types and size limit (10MB)
const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// POST /api/v1/admin/guidance/upload — Upload image for guidance step (API-025, API-026, FEAT-036)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const stepId = formData.get('step_id') as string | null;
    const altText = formData.get('alt_text') as string | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'Image file is required in form-data field "file"' },
        { status: 400 }
      );
    }

    // 1. Validate File MIME Type
    if (!SUPPORTED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported image format (${file.type || 'unknown'}). Allowed formats: JPEG, PNG, WebP, SVG, and GIF.`,
          code: 'UNSUPPORTED_MEDIA_TYPE',
        },
        { status: 400 }
      );
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          error: `File size (${sizeMb} MB) exceeds maximum allowed size of 10 MB.`,
          code: 'FILE_TOO_LARGE',
        },
        { status: 400 }
      );
    }

    // 3. Prepare storage directory and sanitized filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'guidance');
    await mkdir(uploadsDir, { recursive: true });

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/-+/g, '-');
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${safeName}`;
    const filePath = join(uploadsDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const storageReference = `/uploads/guidance/${uniqueFilename}`;

    // 4. Register MediaAsset in Public DB
    const asset = publicDb.addMediaAsset({
      storage_reference: storageReference,
      kind: 'image',
      original_filename: file.name,
      size: file.size,
      uploaded_by: auth.adminUser.user_id,
    });

    // 5. If step_id provided, attach to step immediately
    let updatedStep = null;
    if (stepId) {
      const existing = publicDb.getGuidanceStepById(stepId);
      if (existing) {
        updatedStep = publicDb.updateGuidanceStep(stepId, {
          media_id: asset.media_id,
          image_url: storageReference,
          image_alt: altText || existing.image_alt || file.name.replace(/\.[^/.]+$/, ''),
        });
      }
    }

    // 6. Record Audit Log
    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'upload_guidance_step_image',
      'media_asset',
      asset.media_id,
      null,
      {
        original_filename: file.name,
        size: file.size,
        step_id: stepId || null,
        storage_reference: storageReference,
      }
    );

    return NextResponse.json(
      {
        success: true,
        media_id: asset.media_id,
        url: storageReference,
        original_filename: file.name,
        size: file.size,
        kind: 'image',
        alt_text: updatedStep?.image_alt || altText,
        asset,
        image_url: storageReference,
        step: updatedStep,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
