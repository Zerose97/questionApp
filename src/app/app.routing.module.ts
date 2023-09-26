import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/form',
        pathMatch: 'full'
    },
    {
        path: 'form',
        children: [
            {
                path: '',
                redirectTo: 'builder',
                pathMatch: 'prefix'
            },
            {
                path: 'builder',
                loadChildren: () => import('./modules/builder/builder.module').then(m => m.BuilderModule)
            },
            {
                path: 'answer',
                loadChildren: () => import('./modules/answer/answer.module').then(m => m.AnswerModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }