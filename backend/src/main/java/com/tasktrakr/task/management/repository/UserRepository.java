package com.tasktrakr.task.management.repository;

import com.tasktrakr.task.management.enums.Role;
import com.tasktrakr.task.management.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE " +
            "(:name IS NULL OR LOWER(u.firstname) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(u.middlename) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(u.lastname) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:role IS NULL OR u.role = :role) " +
            "AND (:active IS NULL OR u.active = :active)")
    Page<User> searchUsers(
            String name,
            String email,
            Role role,
            Boolean active,
            Pageable pageable
    );


    long countByRoleAndActive(Role role, Boolean active);
}
