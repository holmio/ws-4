import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'removeCurrentUser'
})
export class RemoveCurrentUserPipe implements PipeTransform {

  transform(items: any[], uidUser: string): any {
    if (!items || !uidUser) {
      return items;
    }
    // Remove the items assigned to current user
    _.remove(items, (n) => {
      return n.user.uid === uidUser;
    });

    return items;
  }

}
