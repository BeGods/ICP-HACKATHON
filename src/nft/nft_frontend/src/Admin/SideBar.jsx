import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import { TbMoneybag } from "react-icons/tb";
import { MdOutlineDashboard, MdLogout } from "react-icons/md";
import { LuCopyPlus } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { CopyIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAndClear } from "../redux/authSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Sidebar data
const sideBarData = [
  {
    text: "Dashboard",
    icon: MdOutlineDashboard,
    Link: "/admin/dashboard",
  },
  {
    text: "Collection",
    icon: LuCopyPlus,
    Link: "/admin/collection",
  },
  {
    text: "Users",
    icon: CiUser,
    Link: "/admin/users",
  },
  {
    text: "Activity",
    icon: TbMoneybag,
    Link: "/admin/activity",
  },
];

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose(); // Close sidebar automatically if screen is resized to >= 1024px (desktop)
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  return (
    <Box
      h={{ base: "fit-content", md: "full" }}
      bg={useColorModeValue("#161618", "#29292C")}
    >
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", lg: "block" }} // Show sidebar on large screens (>= 1024px)
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", lg: "none" }} onOpen={onOpen} />
      {/* Content container */}
      <Box ml={{ base: 0, lg: 60 }} p="4">
        {/* Content goes here */}
      </Box>
    </Box>
  );
}

function SidebarContent({ onClose, ...rest }) {
  const loc = useLocation();
  const location = loc.pathname;
  const [hovered, setHovered] = useState(false);
  const [Copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const logoutHandler = () => {
    dispatch(logoutUserAndClear());
  };

  const handleCopy = () => {
    toast.success("Copied");
  };

  return (
    <Box
      bg={useColorModeValue("#29292C", "gray.900")}
      w={{ base: "full", lg: 60, "2xl": 80 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton
          display={{ base: "flex", lg: "none" }}
          color="white"
          onClick={onClose}
        />
      </Flex>
      <div className="h-[92%] flex flex-col justify-between">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex flex-col gap-1"
        >
          {sideBarData.map((link) => (
            <NavItem
              key={link.text}
              icon={link.icon}
              href={link.Link}
              isActive={location
                .toLowerCase()
                .includes(link.Link.toLowerCase())}
              hovered={hovered}
              onClose={onClose}
            >
              {link.text}
            </NavItem>
          ))}
        </div>
        <div className="flex items-center justify-start px-8 pt-4 mb-9 text-white border-t border-gray-700 gap-x-4 2xl:mb-8">
          <img className="w-12 h-12" src="/image/admin.png" alt="Admin" />
          <div className="space-y-2">
            <div className="flex items-center justify-start gap-x-2">
              <p className="text-lg font-bold">
                Welcome, <span className="text-[#FCD37B]">Admin</span>
              </p>
              <button
                onClick={() => logoutHandler()}
                className="bg-red-100 rounded-full h-7 w-7 hover:bg-red-300 "
              >
                <Icon as={MdLogout} w={4} h={4} color={`red.700`} font="bold" />
              </button>
            </div>
            <div className="flex flex-col">
              <div>
                <input
                  value={
                    user
                      ? `${user.slice(0, 5)}......${user.slice(-6)}`
                      : "No User"
                  }
                  readOnly
                  className="text-green-400 w-[70%] bg-inherit"
                />
                {user && (
                  <CopyToClipboard text={user} onCopy={handleCopy}>
                    <button className="ml-3">
                      <CopyIcon />
                    </button>
                  </CopyToClipboard>
                )}
              </div>
              {Copied && <p>Copied!</p>}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function NavItem({
  icon,
  children,
  href,
  isActive,
  hovered,
  onClose,
  ...rest
}) {
  return (
    <Box
      as={Link}
      to={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      {...rest}
      onClick={onClose}
    >
      <Flex
        align="center"
        font="bold"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        color={isActive ? "black" : "white"}
        cursor="pointer"
        bg={isActive ? "#FCD37B" : ""}
        _hover={{ bg: "#FCD37A30", color: "#fff" }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="24"
            _groupHover={{ color: "#fff" }}
            as={icon}
          />
        )}
        <span className="text-xl font-semibold">{children}</span>
      </Flex>
    </Box>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function MobileNav({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, lg: 60 }}
      px={{ base: 4, lg: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#161618", "gray.900")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        color="white"
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
};
