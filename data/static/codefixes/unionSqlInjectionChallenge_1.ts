import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';

export function searchProducts() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let criteria: string = typeof req.query.q === 'string' ? req.query.q : '';
      criteria = criteria.substring(0, 200); // Limita a 200 caracteres

      const [products]: any = await models.sequelize.query(
        `SELECT * FROM Products 
         WHERE ((name LIKE ? OR description LIKE ?) AND deletedAt IS NULL) 
         ORDER BY name`,
        {
          replacements: [`%${criteria}%`, `%${criteria}%`],
          type: QueryTypes.SELECT,
        }
      );

      for (let i = 0; i < products.length; i++) {
        products[i].name = req.__(products[i].name);
        products[i].description = req.__(products[i].description);
      }

      res.json(utils.queryResultToJson(products));
    } catch (error: any) {
      next(error.parent || error);
    }
  };
}
