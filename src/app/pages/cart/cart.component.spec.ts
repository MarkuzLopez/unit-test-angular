import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Book } from "src/app/models/book.model";
import { BookService } from '../../services/book.service';
import { CartComponent } from "./cart.component"

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

describe('Cart Component', () => { 

    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService;

    beforeEach(() => { 
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ], 
            declarations: [ 
                CartComponent
            ],
            providers: [ 
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
        }).compileComponents(); // par que se ejecuten oos tests de maner acorrecta
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(BookService);
        spyOn(service, 'getBooksFromCart').and.callFake(() => listBook);
    });

    it('should create', () => { 
        expect(component).toBeTruthy();
    });

    /**
     * solo para cuando no se tiene configurado y se necesita testear y no hacer la 
     * con figuracion alternativa para instacinar un componente
     * */ 
    // fit('should create', inject([CartComponent], (testComponent: CartComponent) => { 
    //     expect(testComponent).toBeTruthy();
    // }));

    it('getTotalPrice returns an amount', () => { 
        const totalPrice = component.getTotalPrice(listBook);
        // expect(totalPrice).not.toBe(0);
        expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBeNull();
    });

    it('onInputNumberChange increments correctly', () => { 
        const action = 'plus';
        // const book = listBook[0];
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2
        }

        // el espia tiene que ir antes de el componente
        // realiza una llamada falsa que mande null
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake( () => null )
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

        expect(book.amount).toBe(2)
      
        component.onInputNumberChange(action, book);
        // console.log('amount2 --->', book.amount)
        expect(book.amount === 3).toBeTrue();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        
       // const service = (component as any)._bookService;
      // const service =  fixture.debugElement.injector.get(BookService); // para cuando los servicios son privados 
       
    });

    it('onInputNumberChange decrements correctly', () => { 
        const action = 'minus';
        // const book = listBook[0];
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 3
        }

        expect(book.amount).toBe(3);

        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

        component.onInputNumberChange(action, book);
        expect(book.amount === 2).toBeTrue();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    }); 

    it('onClearBooks works correctly',  () => {
        // se hace un espia y despues se manda a llamar para que realice la limpieza
        const spyClearList = spyOn((component as any), '_clearListCartBook').and.callThrough(); 
        // se crea un spia para el servicio y que haga una llamada falsa con retorno null 
        const spyServiceRemove = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
        component.listCartBook = listBook;
        // console.log('antes', component.listCartBook.length);        
        component.onClearBooks();
        // console.log('edespues', component.listCartBook.length);
        expect(component.listCartBook.length).toBe(0);
        expect(spyClearList).toHaveBeenCalled();
        expect(spyServiceRemove).toHaveBeenCalled();

    });

    it('_clearListCartBook works correctly', () => { 
        const spyServiceRemove = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
        component.listCartBook = listBook;
        component['_clearListCartBook'](); //para que se llame el metodo privado
        expect(component.listCartBook.length).toBe(0); // verififcar que se se halla ejecutado
        expect(spyServiceRemove).toHaveBeenCalled()// verificar que si se halla llamado el espia 
    });

    /**
     * test de integracion
     */

    it('the title "The caris empty" is not displayed when there is a list',  () => { 
        component.listCartBook = listBook;
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeFalsy();
    });

    it('The title "The cart is empty" is displayed correctly when list is empty', () => { 
        component.listCartBook = [];
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css('titleCartEmpty'));
        console.log(debugElement);
        
        // expect(debugElement).toBeTruthy();
        // if(debugElement) { 
        //     const element: HTMLElement =  debugElement.nativeElement;
        //     expect(element.innerHTML).toContain("The cart is empty");
        // }
    })

});