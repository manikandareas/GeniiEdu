'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar';
import { Heading } from '@tiptap/extension-heading';
import { BulletList } from '@tiptap/extension-bullet-list';
type TiptapProps = {
    description: string;
    onChange: (richtext: string) => void;
};

const Tiptap: React.FC<TiptapProps> = ({ description, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Heading.configure({
                HTMLAttributes: {
                    class: 'text-2xl font-bold',
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc pl-4',
                },
            }),
        ],
        content: description,
        editorProps: {
            attributes: {
                class: 'rounded-md border min-h-[150px] border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
            console.log(editor.getHTML());
        },
    });
    return (
        <div className='flex min-h-[180px] flex-col justify-stretch'>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
export default Tiptap;
