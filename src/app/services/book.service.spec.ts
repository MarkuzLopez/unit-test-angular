import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment.prod";
import swal from 'sweetalert2';
import { Book } from "../models/book.model";
import { BookService } from "./book.service"

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
];

const book: Book = {
    name: '',
    author: '',
    isbn: '',
    price: 15, 
    amount: 2
}

describe('BookService', () => { 

    let service: BookService;
    let httpMock: HttpTestingController;
    let storage = { };

    beforeEach(() => { 
        TestBed.configureTestingModule({
            imports: [ 
                HttpClientTestingModule
            ],
            providers: [ 
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => { 
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
        //seteamos el sotrage para que en cada test vaya vacio el storage
        storage = {};
        
        spyOn(localStorage, 'getItem').and.callFake((key: string) => { 
            return storage[key] ? storage[key] : null;
        });
        // recibe el key del sotrage listCarBook y un valor osea el jsonstrinfy
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return storage[key] = value;
        });
    });

    afterAll(() => { 
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    }); 

    it('getBoom return a list of book and does a get method', () => { 
        service.getBooks().subscribe((resp: Book[]) => { 
            expect(resp).toEqual(listBook);
        });

        const req = httpMock.expectOne(environment.API_REST_URL + '/book');
        console.log(req.request.method, 'aqui*****');
        
        expect(req.request.method).toBe('GET');
        req.flush(listBook);
    });

    it('getBooksFromCart return empty array when localStorage is empty', () => { 
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

    it('removeBooksFromCart remove the list cart',  () => {
        service.addBookToCart(book);
        let listBook  = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.removeBooksFromCart();
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

    it('addBookToCart add abook succesfully when the list does not existing the localStorage', () => { 

        //* aagrehgar un espia para el toasSuccess
        const toast  = { 
            fire: () => null
        } as any;
        const spySwalMixin = spyOn(swal, 'mixin').and.callFake(() => { 
            return toast;
        })

        let listBook  = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(book);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        expect(spySwalMixin).toHaveBeenCalled();
    })
})