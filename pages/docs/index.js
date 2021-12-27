import { getLayout } from "@/layouts/dashboard";
import { Box } from "@chakra-ui/core"
import SwaggerUI from "swagger-ui-react"
import 'swagger-ui-react/swagger-ui.css';

export default function Docs() {
    return (
        <div >
            <SwaggerUI url="/swagger.json" />
        </div>
    )
}
// Docs.getLayout = getLayout;