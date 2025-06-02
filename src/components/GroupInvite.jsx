import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import useAxiosPublic from '../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const GroupInvite = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGroupAccess = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        // Check if user is already a member
        const response = await axiosPublic.get(`/groups/${groupId}/check-member/${user.email}`);
        const { isMember, isAdmin, group } = response.data;

        // If group doesn't exist
        if (!group) {
          Swal.fire({
            title: 'Error',
            text: 'Group not found. The group may have been deleted or the invite link is invalid.',
            icon: 'error'
          });
          navigate('/');
          return;
        }

        if (isMember || isAdmin) {
          // User is already a member, redirect to group tasks
          navigate(`/groups/${groupId}`);
          return;
        }

        // User is not a member, show join prompt
        const result = await Swal.fire({
          title: 'Join Group',
          text: `You've been invited to join "${group.name}". Would you like to join?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, join group',
          cancelButtonText: 'No, go back'
        });

        if (result.isConfirmed) {
          // User wants to join
          try {
            const joinResponse = await axiosPublic.post(`/groups/${groupId}/join`, { 
              userEmail: user.email 
            });
            
            if (joinResponse.data.isMember) {
              Swal.fire({
                title: 'Success!',
                text: 'You have joined the group successfully.',
                icon: 'success'
              });
              navigate(`/groups/${groupId}`);
            } else {
              throw new Error('Failed to join group');
            }
          } catch (error) {
            console.error('Error joining group:', error);
            Swal.fire({
              title: 'Error',
              text: error.response?.data?.message || 'Failed to join group. Please try again.',
              icon: 'error'
            });
            navigate('/');
          }
        } else {
          // User declined to join
          Swal.fire({
            title: 'Cancelled',
            text: 'You can join the group later using the invite link.',
            icon: 'info'
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking group access:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Failed to process invite. Please try again.',
          icon: 'error'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkGroupAccess();
  }, [groupId, user, navigate, axiosPublic]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return null; // Component handles everything through effects and redirects
};

export default GroupInvite; 