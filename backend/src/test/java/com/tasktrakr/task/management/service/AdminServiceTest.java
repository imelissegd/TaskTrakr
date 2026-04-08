package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.UserSearchDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.enums.Role;
import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.exception.InvalidUserStateException;
import com.tasktrakr.task.management.exception.LastAdminException;
import com.tasktrakr.task.management.exception.TaskNotFoundException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.Task;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.TaskRepository;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.implementation.AdminServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private AdminServiceImplementation adminService;

    private User user;
    private Task task;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("john");
        user.setFirstname("John");
        user.setLastname("Doe");
        user.setRole(Role.Admin);
        user.setActive(true);

        task = new Task();
        task.setTaskId(1L);
        task.setTitle("Test Task");
        task.setDescription("Desc");
        task.setStatus(TaskStatus.Pending);
        task.setUser(user);
    }

    // ========================= TASK TESTS =========================

    @Test
    void shouldReturnAllTasks() {
        when(taskRepository.searchTasksForAdmin(
                eq(null), // userId
                isNull(), // title
                isNull(), // status
                isNull(), // deadlineFrom
                isNull(), // deadlineTo
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of(task)));

        TaskSearchDTO searchDTO = new TaskSearchDTO();
        searchDTO.setPage(0);
        searchDTO.setSize(10);
        searchDTO.setSortBy("createdAt");
        searchDTO.setSortDir("desc");

        FilterResponseDTO<AdminTaskResponseDTO> result = adminService.searchAllTasks(searchDTO, null); // null

        assertEquals(1, result.getContent().size());
        assertEquals("Test Task", result.getContent().get(0).getTitle());
    }

    @Test
    void shouldReturnTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        AdminTaskResponseDTO result = adminService.getTaskById(1L);

        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void shouldThrowException_whenTaskNotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () ->
                adminService.getTaskById(1L)
        );
    }

    // ========================= USER TESTS =========================

    @Test
    void shouldReturnAllUsers() {
        when(userRepository.searchUsers(
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of(user)));

        UserSearchDTO searchDTO = new UserSearchDTO();
        searchDTO.setPage(0);
        searchDTO.setSize(10);
        searchDTO.setSortBy("createdAt");
        searchDTO.setSortDir("desc");

        FilterResponseDTO<UserResponseDTO> result = adminService.searchUsers(searchDTO);

        // Access the list inside FilterResponseDTO
        List<UserResponseDTO> users = result.getContent();

        assertEquals(1, users.size());
        assertEquals("john", users.get(0).getUsername());
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponseDTO result = adminService.getUserById(1L);

        assertEquals("john", result.getUsername());
    }

    @Test
    void shouldThrowException_whenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                adminService.getUserById(1L)
        );
    }

    // ========================= UPDATE USER =========================

    @Test
    void shouldUpdateUser() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstname("Jane");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO result = adminService.updateUser(1L, dto);

        assertEquals("Jane", result.getFirstname());
    }

    // ========================= ROLE UPDATE =========================

    @Test
    void shouldThrow_whenSameRole() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(InvalidUserStateException.class, () ->
                adminService.updateUserRole(1L, Role.Admin)
        );
    }

    @Test
    void shouldThrow_whenLastAdminDemoted() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.countByRoleAndActive(Role.Admin, true)).thenReturn(1L);

        assertThrows(LastAdminException.class, () ->
                adminService.updateUserRole(1L, Role.User)
        );
    }

    @Test
    void shouldUpdateUserRole() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.countByRoleAndActive(Role.Admin, true)).thenReturn(2L);
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO result = adminService.updateUserRole(1L, Role.User);

        assertEquals(Role.User, result.getRole());
    }

    // ========================= DEACTIVATE =========================

    @Test
    void shouldDeactivateUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.countByRoleAndActive(Role.Admin, true)).thenReturn(2L);

        adminService.deactivateUser(1L);

        assertFalse(user.getActive());
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrow_whenAlreadyDeactivated() {
        user.setActive(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(InvalidUserStateException.class, () ->
                adminService.deactivateUser(1L)
        );
    }

    @Test
    void shouldThrow_whenLastAdminDeactivated() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.countByRoleAndActive(Role.Admin, true)).thenReturn(1L);

        assertThrows(LastAdminException.class, () ->
                adminService.deactivateUser(1L)
        );
    }

    // ========================= REACTIVATE =========================

    @Test
    void shouldReactivateUser() {
        user.setActive(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        adminService.reactivateUser(1L);

        assertTrue(user.getActive());
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrow_whenAlreadyActive() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(InvalidUserStateException.class, () ->
                adminService.reactivateUser(1L)
        );
    }
}