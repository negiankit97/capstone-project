import * as AWS from 'aws-sdk';
import * as AWSXRAY from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { RecipeItem } from "../models/RecipeItem";
import { UpdateRecipeItem } from "../models/UpdateRecipeItem";

const XAWS = AWSXRAY.captureAWS(AWS);

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

const url_expiration = process.env.SIGNED_URL_EXPIRATION;

export class RecipeAccess {
  constructor(
      private docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private tableName: string = process.env.TABLE_NAME,
      private s3Bucket: string = process.env.IMAGES_S3_BUCKET
      ) {}

  async getRecipes(userId: string) {
    const recipeItems = await this.docClient.query({
        TableName: this.tableName,
        KeyConditionExpression:'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise();

    console.log('Recipes retrieved successfully!');

    const recipes = recipeItems.Items;

    return recipes as RecipeItem[];
  }

  async createRecipe(item: RecipeItem) {
    await this.docClient.put({
        TableName: this.tableName,
        Item: item
    }).promise();

    return item.id;
  }

  async updateRecipe(userId: string,id: string,item: UpdateRecipeItem) {
      await this.docClient.update({
          TableName: this.tableName,
          Key:{
              userId,
              id
          },
          UpdateExpression: 'set name = :n, description = :d, reviewRating: :r, favourite: :f  ',
          ExpressionAttributeValues:{
              ':n': item.name,
              ':d': item.description,
              ':r': item.reviewRating,
              ':f': item.favourite
          },
          ReturnValues: 'UPDATED_NEW'
          
      }).promise();
      console.log('Updated Recipe Successfully!');

      return item;
  }

  async deleteRecipe(userId: string, id: string) {
      return await this.docClient.delete({
          TableName: this.tableName,
          Key:{
              userId,
              id
          }
      }).promise();
  }

  async generateUploadUrl(userId: string,id: string) {
      const url = getUploadUrl(id, this.s3Bucket);

      const attachmentUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${id}`
      await this.docClient.update({
          TableName: this.tableName,
          Key: {
              userId
          },
          UpdateExpression: 'set imageUrl = :a',
          ExpressionAttributeValues: {
              ':a': attachmentUrl
          },
          ReturnValues: 'UPDATED_NEW'
      }).promise();

      console.log('Presigned url generated successfully: ', url);

      return url;
  }
}

function getUploadUrl(id: string, bucketName: string){
    return s3.getSignedUrl('putObject',{
        Bucket: bucketName,
        Key: id,
        Expires: parseInt(url_expiration)
    });
}
