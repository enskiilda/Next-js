type TextStreamUpdate = {
	done: boolean;
	value: string;
	sources?: any;
	selectedModelId?: any;
	error?: any;
	usage?: ResponseUsage;
};

type ResponseUsage = {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
	[other: string]: unknown;
};

export async function* createOpenAITextStream(
	responseBody: ReadableStream<Uint8Array>,
	splitLargeDeltas: boolean
): AsyncGenerator<TextStreamUpdate> {
	const decoder = new TextDecoder();
	const reader = responseBody.getReader();

	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				yield { done: true, value: '' };
				break;
			}

			const text = decoder.decode(value, { stream: true });
			const lines = text.split('\n').filter(line => line.trim().startsWith('data:'));

			for (const line of lines) {
				const data = line.replace(/^data:\s*/, '');
				if (data.startsWith('[DONE]')) {
					yield { done: true, value: '' };
					break;
				}

				try {
					const parsedData = JSON.parse(data);

					if (parsedData.error) {
						yield { done: true, value: '', error: parsedData.error };
						break;
					}

					if (parsedData.sources) {
						yield { done: false, value: '', sources: parsedData.sources };
						continue;
					}

					if (parsedData.selected_model_id) {
						yield { done: false, value: '', selectedModelId: parsedData.selected_model_id };
						continue;
					}

					if (parsedData.usage) {
						yield { done: false, value: '', usage: parsedData.usage };
						continue;
					}

					yield {
						done: false,
						value: parsedData.choices?.[0]?.delta?.content ?? ''
					};
				} catch (e) {
					// Skip non-JSON lines
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}
