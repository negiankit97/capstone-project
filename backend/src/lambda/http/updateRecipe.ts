import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getUserId } from "../utils";
import { updateRecipe } from "../../businessLogic/recipes";
import { UpdateRecipeRequest } from "../../requests/UpdateRecipeRequest";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    
  console.log("Processing event", event);

  const item: UpdateRecipeRequest = JSON.parse(event.body);

  const id = event.pathParameters.id;

  const userId = getUserId(event);

  const recipes = await updateRecipe(userId, id, item);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      recipes,
      message: "Created Recipe Successfully!",
    }),
  };
};
