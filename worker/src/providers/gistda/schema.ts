import { GistdaProviderError } from './errors';

export async function validatePngTile(response: Response): Promise<ArrayBuffer> {
  const contentType = response.headers.get('content-type')?.split(';')[0].trim();
  if (contentType !== 'image/png') {
    throw new GistdaProviderError(
      'INVALID_RESPONSE',
      502,
      'GISTDA response is not a PNG tile',
    );
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength === 0) {
    throw new GistdaProviderError(
      'INVALID_RESPONSE',
      502,
      'GISTDA response tile is empty',
    );
  }
  return bytes;
}
