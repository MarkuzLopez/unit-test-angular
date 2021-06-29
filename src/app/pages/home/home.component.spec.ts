import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Book } from "src/app/models/book.model";
import { BookService } from "../../services/book.service";
import { HomeComponent } from "./home.component"

const listBook: Book [] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 3
    }
]

//test para pipe 
@Pipe({ name: 'reduceText' })
class ReducerTextPipeMock implements PipeTransform { 
    transform(): string { 
        return '';
    }
}

describe('Home component', () => { 

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(() => { 
      
        TestBed.configureTestingModule({ 
            imports: [ 
                HttpClientTestingModule
            ],
            declarations:[
                HomeComponent,
                ReducerTextPipeMock
            ],
            providers: [ 
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();        
    });


    beforeEach(() => { 
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be exixt component', () => { 
        expect(component).toBeTruthy();
    });

    // fit('getBook get books from the subscription', () => {  agregandolo F es para que solo se ejecute uno solo
    // se puede agregar en el describe tambien 
    // si se agrega x al principio omite la prueba es cmo si se estuviera comentado pero con alerta de que se va a realizar.
    
    it('getBook get books from the subscription', () => { 
        const bookService =  fixture.debugElement.injector.get(BookService);
        const listBook: Book[] = [];
        const spy1 =  spyOn(bookService, 'getBooks').and.returnValue(of(listBook));
        component.getBooks();

        expect(spy1).toHaveBeenCalled();
        expect(component.listBook.length).toBe(0);
    })

})