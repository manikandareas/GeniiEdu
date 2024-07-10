import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';

type MaterialsCardProps = {
    createdAt: Date | null;
    updatedAt: Date | null;
    id: string;
    classId: string;
    title: string;
    content: string;
    authorId: string;
    publishedAt: Date;
    files: {
        createdAt: Date | null;
        updatedAt: Date | null;
        id: number;
        learningMaterialId: string;
        fileId: string;
    }[];
};

const MaterialsCard: React.FC<MaterialsCardProps> = (props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.content}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    );
};
export default MaterialsCard;
