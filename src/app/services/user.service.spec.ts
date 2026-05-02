import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8090/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', address: '456 Oak Ave' }
      ];

      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when getting all users', () => {
      service.getAllUsers().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', () => {
      const mockUser: User = { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '1234567890', 
        address: '123 Main St' 
      };

      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when user not found', () => {
      service.getUserById(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', () => {
      const mockUser: User = { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '1234567890', 
        address: '123 Main St' 
      };

      service.getUserByEmail('john@example.com').subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/email/john@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when email not found', () => {
      service.getUserByEmail('notfound@example.com').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/email/notfound@example.com`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: User = { 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '1234567890', 
        address: '123 Main St' 
      };
      const createdUser: User = { ...newUser, id: 1 };

      service.createUser(newUser).subscribe(user => {
        expect(user).toEqual(createdUser);
        expect(user.id).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);
    });

    it('should handle error when email already exists', () => {
      const newUser: User = { 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '1234567890', 
        address: '123 Main St' 
      };

      service.createUser(newUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updatedUser: User = { 
        id: 1, 
        name: 'John Updated', 
        email: 'johnupdated@example.com', 
        phone: '9999999999', 
        address: '789 New St' 
      };

      service.updateUser(1, updatedUser).subscribe(user => {
        expect(user).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should handle error when user not found for update', () => {
      const updatedUser: User = { 
        name: 'John Updated', 
        email: 'johnupdated@example.com', 
        phone: '9999999999', 
        address: '789 New St' 
      };

      service.updateUser(999, updatedUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when user not found for deletion', () => {
      service.deleteUser(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('countUsers', () => {
    it('should return the count of users', () => {
      const count = 5;

      service.countUsers().subscribe(result => {
        expect(result).toBe(count);
      });

      const req = httpMock.expectOne(`${apiUrl}/count`);
      expect(req.request.method).toBe('GET');
      req.flush(count);
    });

    it('should handle error when counting users', () => {
      service.countUsers().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/count`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});

// Made with Bob
