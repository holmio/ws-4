import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryConfig } from 'src/app/interfaces/common.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { tap, take, scan } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    // Source data
    private done$ = new BehaviorSubject(false);
    private loading$ = new BehaviorSubject(false);
    private data$ = new BehaviorSubject([]);

    private query: QueryConfig;

    // Observable data
    data: Observable<any>;
    done: Observable<boolean> = this.done$.asObservable();
    loading: Observable<boolean> = this.loading$.asObservable();


    constructor(private afs: AngularFirestore) { }

    // Initial query sets options and defines the Observable
    // passing opts will override the defaults
    init(path: string, field: string, opts?: any) {
        this.query = {
            path,
            field,
            limit: 2,
            reverse: false,
            prepend: false,
            ...opts
        };

        const first = this.afs.collection(this.query.path, ref => {
            return ref
                .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                .limit(this.query.limit);
        });

        this.mapAndUpdate(first);

        // Create the observable array for consumption in components
        this.data = this.data$.asObservable().pipe(
            scan((acc, val) => {
                return this.query.prepend ? val.concat(acc) : acc.concat(val);
            })
        );
    }


    // Retrieves additional data from firestore
    more() {
        const cursor = this.getCursor()

        const more = this.afs.collection(this.query.path, ref => {
            return ref
                .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                .limit(this.query.limit)
                .startAfter(cursor)
        })
        this.mapAndUpdate(more);
    }


    // Determines the doc snapshot to paginate query 
    private getCursor() {
        const current = this.data$.value;
        if (current.length) {
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc
        }
        return null;
    }


    // Maps the snapshot to usable format the updates source
    private mapAndUpdate(col: AngularFirestoreCollection<any>) {

        if (this.done$.value || this.loading$.value) { return };

        // loading
        this.loading$.next(true);

        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges().pipe(
            tap(arr => {
                let values = arr.map(snap => {
                    const data = snap.payload.doc.data();
                    const doc = snap.payload.doc;
                    return { ...data, doc};
                })

                // If prepending, reverse the batch order
                values = this.query.prepend ? values.reverse() : values;

                // update source with new values, done loading
                this.data$.next(values)
                this.loading$.next(false);

                // no more values, mark done
                if (!values.length) {
                    this.done$.next(true);
                }
            }),
            take(1))
            .subscribe();

    }

}