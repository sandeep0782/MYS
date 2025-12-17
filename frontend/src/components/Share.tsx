import { RWebShare } from 'react-web-share'
import { Button } from './ui/button'
import { Share2 } from 'lucide-react'

interface RWebShareProps {
    url: string,
    title: string,
    text: string,
}
export const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
    return (
        <RWebShare data={{
            text, url, title
        }}
            onClick={() => console.log("SHared Successfully")}
        >
            <Button size='sm' variant='outline'>
                <Share2 className='h-4 w-4 mr-2' />
                Share
            </Button>
        </RWebShare>
    )
}