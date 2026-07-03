using { my.bookshop as my } from '../db/schema';
//allow us to query books data through odata service
service CatalogService {
    entity Books as  projection on my.Books;
}