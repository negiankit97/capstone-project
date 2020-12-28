export interface RecipeItem {
    recipeId: string,
    userId: string,
    name: string,
    description: string,
    imageUrl: string,
    createdAt: string,
    favourite: boolean,
    reviewRating: number
};