package com.vehicle.repository;

import com.vehicle.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    // Find users by role and status
    List<User> findByRoleAndStatus(String role, String status);
    
    // Find users by role only
    List<User> findByRole(String role);
    
    // Find users by status only
    List<User> findByStatus(String status);
    
    // Check if email already exists
    boolean existsByEmail(String email);
    
    // Find users by name containing (for search functionality)
    List<User> findByNameContainingIgnoreCase(String name);
}