const WEB3FORMS_ACCESS_KEY = '806ceb1c-2118-4c3a-a69c-f63541491dec';

export interface Web3FormsResponse {
  success: boolean;
  message?: string;
  ref_id?: string;
}

export async function submitToWeb3Forms(data: Record<string, unknown>): Promise<Web3FormsResponse> {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: 'Chef de Chef - Formular nou',
    ...data,
  };

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}
