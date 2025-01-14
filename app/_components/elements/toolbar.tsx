import { Editor } from '@tiptap/react';
import { Toggle } from '../ui/toggle';
import { Bold, Heading2, Italic, List, Strikethrough } from 'lucide-react';

type ToolbarProps = {
    editor: Editor | null;
};

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    if (!editor) return null;
    return (
        <div className='border border-input bg-transparent'>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('heading')}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className='size-4' />
            </Toggle>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('bold')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold className='size-4' />
            </Toggle>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('italic')}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className='size-4' />
            </Toggle>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('strike')}
                onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough className='size-4' />
            </Toggle>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('bulletList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className='size-4' />
            </Toggle>
        </div>
    );
};
export default Toolbar;
