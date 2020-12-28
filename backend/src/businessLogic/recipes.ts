
import { UpdateRecipeItem } from "../models/UpdateRecipeItem";
import { RecipeAccess } from "../dataLayer/recipeAccess";
import { CreateRecipeItem } from "../requests/CreateRecipeRequest";
import * as uuid from "uuid";

const recipesAccess = new RecipeAccess();

export function getRecipes(userId: string) {
return recipesAccess.getRecipes(userId); 
}

export function createRecipe(item: CreateRecipeItem, userId: string){
    const id = uuid.v4();

    return recipesAccess.createRecipe({
        recipeId:id,
        name: item.name,
        userId,
        description: item.description,
        favourite:false,
        reviewRating: item.reviewRating,
        createdAt: new Date().toISOString(),
        imageUrl: ''
    });
}

export function updateRecipe(userId: string,id: string, item: UpdateRecipeItem): Promise<UpdateRecipeItem> {
    return recipesAccess.updateRecipe(userId, id, item);
}

export async function deleteRecipe(userId, id){
    return recipesAccess.deleteRecipe(userId, id);
}

export async function generateUploadUrl(userId: string, id: string){
    return recipesAccess.generateUploadUrl(userId, id);
}