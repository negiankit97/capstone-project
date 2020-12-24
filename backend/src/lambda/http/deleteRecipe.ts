import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { deleteRecipe } from "../../businessLogic/recipes";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Processing Event: ', event);

    const recipeId = event.pathParameters.id;

    const userId = getUserId(event);

    const id = await deleteRecipe(userId, recipeId);

    return {
        statusCode: 204,
        headers:{
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            id,
            message: "Deleted Recipe Successfully!"
        })
    }
}