import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

const ModeSelection = () => {
    return (
        <div className="flex flex-col px-2 py-10 sm:px-10">
            <div className="flex flex-col items-center justify-center mt-10 text-center">
                <h1 className="mb-10 text-xl font-bold text-secondary-900 sm:text-2xl">
                    Choose mode
                </h1>
                <div className="flex flex-col gap-5 sm:flex-row md:gap-10">

                    <Link to={'/pack'}>
                        <Card className="w-[350px] cursor-pointer flex flex-col justify-between hover:bg-slate-50 hover:border-secondary/50 min-h-[380px]">
                            <CardHeader>
                                <CardTitle>Efficient packing</CardTitle>
                                <CardDescription>For packing as many images as possible in one page so as to reduce the number of pages required</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <img src="packed_images_example.png" />

                            </CardContent>

                        </Card>
                    </Link>

                    <Link to={'/freeform'}>

                        <Card className="w-[350px] cursor-pointer flex flex-col justify-between hover:bg-slate-50 hover:border-secondary/50 min-h-[380px]">
                            <CardHeader>
                                <CardTitle>FreeForm </CardTitle>
                                <CardDescription>Move and resize the images freely for printing</CardDescription>
                            </CardHeader>
                            <CardContent >
                                <img src="free_form_example.png" />

                            </CardContent>

                        </Card>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default ModeSelection