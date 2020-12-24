import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { generateUploadUrl } from '../../businessLogic/recipes';

export const handler: APIGatewayProxyHandler =  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Processing event: ', event);

    const recipeId = event.pathParameters.id;

    const userId = getUserId(event);

    const uploadUrl = await generateUploadUrl(recipeId, userId);


    return {
        statusCode: 200,
        headers: {},
        body:JSON.stringify({
            uploadUrl
        })
    };
}