import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { createRecipe } from '../../businessLogic/recipes';
import { CreateRecipeItem } from '../../requests/CreateRecipeRequest';

import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event', event);

    const item: CreateRecipeItem = JSON.parse(event.body);

    const userId = getUserId(event);

    const id = await createRecipe(item, userId);

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            id,
            message: "Created Recipe Successfully!"
        })
    }
}