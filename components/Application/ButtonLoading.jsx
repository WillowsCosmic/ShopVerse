import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ButtonLoading = ({type, text, loading, onClick,className,...props}) => {
  return (
    <Button 
    size="sm" 
    variant="outline" 
    type={type} 
    disabled={loading} 
    onClick={onClick} 
    {...props} 
    className={cn("",className)}>
      {loading && <Spinner className="text-white"/>}
      {text}
    </Button>
  )
}
//"bg-linear-to-r from-yellow-300 to-amber-500 hover:from-amber-600 hover:to-yellow-600"

export default ButtonLoading
