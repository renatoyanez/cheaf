import { Roles } from "../enums/auth";
import {Product} from '../types/products'

const roleFilterRules: Partial<Record<Roles, string[]>> = {
  [Roles.VEGAN]: ["meat", "seafood", "dairy"],
  [Roles.USER]: ["pet supplies", "health supplements", "household essentials"],
  // Add whatever role you want
};

/**
 *
 * @param roles Array of roles to filter by
 * @param list The list to filter
 * @returns The list of products, but filtered by roles. Some roles should see products others can't
 * For example: The Vegan role can't see any meat, seafood, or dairy product.
 */
export const filterProductsByRoles = (roles: Roles[], list: Product[]) => {
  if (!roles.length) return list;

  return list.filter((product) => {
    return roles.every((role) => {
      const forbiddenTags = roleFilterRules[role];
      if (!forbiddenTags) return true;
      return !product.tags.some((tag) =>
        forbiddenTags.includes(tag.toLowerCase())
      );
    });
  });
};