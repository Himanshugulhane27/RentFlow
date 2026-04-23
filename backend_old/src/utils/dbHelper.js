const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * DynamoDB helper with pagination support.
 *
 * The original scanTable() was fine for our small dataset, but DynamoDB
 * scan only returns 1MB per call. Once we hit ~1000 properties this would
 * silently return partial results — super confusing bug to track down.
 * Now scanAll() follows the LastEvaluatedKey pagination automatically.
 */

const dbHelper = {
  async getItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key
    };
    const result = await dynamodb.get(params).promise();
    return result.Item || null;
  },

  async putItem(tableName, item) {
    const params = {
      TableName: tableName,
      Item: {
        ...item,
        updatedAt: new Date().toISOString()
      }
    };
    await dynamodb.put(params).promise();
    return item;
  },

  /**
   * Scan with automatic pagination — collects all items across
   * multiple 1MB pages so the caller doesn't have to worry about it.
   */
  async scanTable(tableName) {
    const allItems = [];
    let lastKey = null;

    do {
      const params = {
        TableName: tableName,
        ...(lastKey && { ExclusiveStartKey: lastKey })
      };
      const result = await dynamodb.scan(params).promise();
      allItems.push(...(result.Items || []));
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return allItems;
  },

  /**
   * Paginated scan for the frontend — returns a page of results
   * along with the cursor needed to fetch the next page.
   */
  async scanPaginated(tableName, limit = 20, startKey = null) {
    const params = {
      TableName: tableName,
      Limit: limit,
      ...(startKey && { ExclusiveStartKey: startKey })
    };
    const result = await dynamodb.scan(params).promise();
    return {
      items: result.Items || [],
      lastKey: result.LastEvaluatedKey || null,
      hasMore: !!result.LastEvaluatedKey
    };
  },

  async deleteItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key
    };
    await dynamodb.delete(params).promise();
  },

  /**
   * Conditional put — only writes if the item doesn't already exist.
   * Useful for preventing duplicate tenant registrations.
   */
  async putItemIfNotExists(tableName, item, keyName) {
    const params = {
      TableName: tableName,
      Item: item,
      ConditionExpression: `attribute_not_exists(${keyName})`
    };
    try {
      await dynamodb.put(params).promise();
      return { created: true, item };
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        return { created: false, item: null };
      }
      throw err;
    }
  }
};

module.exports = dbHelper;