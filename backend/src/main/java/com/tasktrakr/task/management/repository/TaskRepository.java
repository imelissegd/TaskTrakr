package com.tasktrakr.task.management.repository;

import com.tasktrakr.task.management.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Used by: GET /api/v1/tasks  →  all tasks paginated (admin view)
    Page<Task> findAll(Pageable pageable);

    // Used by: GET /api/v1/tasks/user/{userId}  →  user's own tasks, paginated
    Page<Task> findByUser_UserId(Long userId, Pageable pageable);

    // Used by: GET /api/v1/tasks/user/{userId}?status=PENDING  →  filtered + paginated
    Page<Task> findByUser_UserIdAndStatus(Long userId, String status, Pageable pageable);

    // Used by: admin user-detail view  →  all tasks embedded in user detail, no paging needed
    List<Task> findByUser_UserId(Long userId);

    // Used by: service layer ownership check before update / delete
    boolean existsByTaskIdAndUser_UserId(Long taskId, Long userId);
}