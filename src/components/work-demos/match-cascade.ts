// Placeholder text as a PDF text layer holds it: an "fi" ligature and curly quotes intact
export const PAGE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Excepteur sint occaecat cupidatat non proident sunt in culpa qui ﬁnibus et quasi “Lorem” deserunt mollit anim id est laborum nam libero tempore cum soluta nobis.

Curabitur pretium tincidunt lacus nulla gravida orci a odio, nullam varius turpis et commodo pharetra est eros bibendum elit. Nec luctus magna felis sollicitudin mauris integer in mauris eu nibh euismod gravida duis ac tellus et risus vulputate vehicula.

Donec lacinia congue felis in faucibus, ut aliquam purus sit amet luctus venenatis.`;

// The model quotes the same text back cleaned up, split into the chunks it was given
const clean = (text: string) => text.replace(/ﬁ/g, 'fi').replace(/[“”]/g, '"');
const paragraphs = PAGE.split('\n\n');
const CHUNKS = [ `${paragraphs[0]}\n\n${paragraphs[1]}`, paragraphs[2] ].map(clean);

const words = (text: string) => text.split(/\s+/).filter(Boolean);

const windows = (text: string, size: number) => {
    const all = words(text);
    return all.slice(0, all.length - size + 1).map((_, i) => all.slice(i, i + size).join(' '));
};

export const PASSES = [
    { label: 'Whole chunk', split: (chunk: string) => [ chunk ] },
    { label: 'Paragraph', split: (chunk: string) => chunk.split('\n\n') },
    { label: 'Sentence', split: (chunk: string) => chunk.split(/(?<=[.!?])\s+/) },
    { label: '5-word window', split: (chunk: string) => windows(chunk, 5) },
];

export const PAGE_WORDS = words(PAGE);

// For each page word, the first pass whose pieces located it, or -1 if none did
export const FOUND_BY: number[] = (() => {
    const found = PAGE_WORDS.map(() => -1);
    PASSES.forEach(({ split }, pass) => {
        CHUNKS.flatMap(split).forEach((piece) => {
            const target = words(piece);
            for (let start = 0; start + target.length <= PAGE_WORDS.length; start++) {
                if (target.every((word, i) => PAGE_WORDS[start + i] === word)) {
                    target.forEach((_, i) => {
                        if (found[start + i] === -1) {
                            found[start + i] = pass;
                        }
                    });
                }
            }
        });
    });
    return found;
})();

export const COVERAGE = PASSES.map((_, pass) =>
    Math.round(100 * FOUND_BY.filter((p) => p !== -1 && p <= pass).length / PAGE_WORDS.length));
