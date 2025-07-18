import { IllegalStateException } from '../global/exceptions/illegal-state.exception';

export abstract class FormUtil {
  public static get(formData: any, path: string): any {
    const properties = path.split('.');
    let current: any = formData;

    for (const prop of properties) {
      if (current == null || !current.hasOwnProperty(prop)) {
        throw new IllegalStateException(
          `Property "${prop}" is missing in path "${path}"`,
        );
      }
      current = current[prop];
    }

    return current;
  }
}
