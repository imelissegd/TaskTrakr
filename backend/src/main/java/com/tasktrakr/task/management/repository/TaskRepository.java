package com.tasktrakr.task.management.repository;

import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser_UserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.userId = :userId " +
            "AND (:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:deadlineFrom IS NULL OR t.deadline >= :deadlineFrom) " +
            "AND (:deadlineTo IS NULL OR t.deadline <= :deadlineTo)")
    Page<Task> searchTasksforUser(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("status") TaskStatus status,
            @Param("deadlineFrom") LocalDate deadlineFrom,
            @Param("deadlineTo") LocalDate deadlineTo,
            Pageable pageable
    );

    @Query("SELECT t FROM Task t WHERE " +
            "(:userId IS NULL OR t.user.userId = :userId) " +
            "AND (:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:deadlineFrom IS NULL OR t.deadline >= :deadlineFrom) " +
            "AND (:deadlineTo IS NULL OR t.deadline <= :deadlineTo)")
    Page<Task> searchTasksForAdmin(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("status") TaskStatus status,
            @Param("deadlineFrom") LocalDate deadlineFrom,
            @Param("deadlineTo") LocalDate deadlineTo,
            Pageable pageable
    );
}