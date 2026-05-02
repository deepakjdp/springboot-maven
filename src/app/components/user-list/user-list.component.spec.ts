import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: UserService;
  let mockUsers: User[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ UserService ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', address: '456 Oak Ave' }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load users on initialization', () => {
      jest.spyOn(userService, 'getAllUsers').mockReturnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.users.length).toBe(2);
      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle error when loading users fails', () => {
      const errorMessage = 'Error loading users';
      jest.spyOn(userService, 'getAllUsers').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      component.ngOnInit();

      expect(component.users.length).toBe(0);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('Failed to load users');
    });
  });

  describe('loadUsers', () => {
    it('should set loading to true while fetching users', () => {
      jest.spyOn(userService, 'getAllUsers').mockReturnValue(of(mockUsers));

      component.loadUsers();

      expect(userService.getAllUsers).toHaveBeenCalled();
    });

    it('should populate users array on successful fetch', () => {
      jest.spyOn(userService, 'getAllUsers').mockReturnValue(of(mockUsers));

      component.loadUsers();

      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should set error message on failed fetch', () => {
      jest.spyOn(userService, 'getAllUsers').mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      component.loadUsers();

      expect(component.error).toBe('Failed to load users');
      expect(component.loading).toBe(false);
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      component.users = [...mockUsers];
      jest.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('should delete user and reload list on successful deletion', () => {
      jest.spyOn(userService, 'deleteUser').mockReturnValue(of(void 0));
      jest.spyOn(component, 'loadUsers');

      component.deleteUser(1);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(component.loadUsers).toHaveBeenCalled();
    });

    it('should not delete if user cancels confirmation', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      jest.spyOn(userService, 'deleteUser');

      component.deleteUser(1);

      expect(userService.deleteUser).not.toHaveBeenCalled();
    });

    it('should handle error when deletion fails', () => {
      jest.spyOn(userService, 'deleteUser').mockReturnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.deleteUser(1);

      expect(component.error).toBe('Failed to delete user');
    });

    it('should return early if id is undefined', () => {
      jest.spyOn(userService, 'deleteUser');

      component.deleteUser(undefined);

      expect(userService.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('getUserCount', () => {
    it('should return the correct count of users', () => {
      component.users = mockUsers;

      const count = component.getUserCount();

      expect(count).toBe(2);
    });

    it('should return 0 when users array is empty', () => {
      component.users = [];

      const count = component.getUserCount();

      expect(count).toBe(0);
    });
  });
});

// Made with Bob
