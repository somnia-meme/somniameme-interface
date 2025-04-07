import { useState, useRef } from "react";
import { useWriteContract } from "wagmi";
import {
  TOKEN_FACTORY_ADDRESS,
  TOKEN_FACTORY_FEE,
  TokenFactoryABI,
} from "@/lib/config";
import { parseEther, parseEventLogs } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { wagmiAdapter } from "@/providers/appkit-provider";

export interface TokenFormData {
  name: string;
  ticker: string;
  description: string;
  image: File | null;
  telegramLink: string;
  twitterLink: string;
  websiteLink: string;
  discordLink: string;
  initialBuyAmount: string;
}

export interface TokenFormErrors {
  name?: string;
  ticker?: string;
  description?: string;
  image?: string;
  telegramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  discordLink?: string;
  [key: string]: string | undefined;
}

export interface SuccessModalState {
  isOpen: boolean;
  tokenAddress: string;
  transactionHash: string;
  blockNumber: string;
}

export const useTokenCreationForm = () => {
  const { writeContractAsync } = useWriteContract();

  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    ticker: "",
    description: "",
    image: null,
    telegramLink: "",
    twitterLink: "",
    websiteLink: "",
    discordLink: "",
    initialBuyAmount: "0.0001",
  });

  const [errors, setErrors] = useState<TokenFormErrors>({});

  const [successModal, setSuccessModal] = useState<SuccessModalState>({
    isOpen: false,
    tokenAddress: "",
    transactionHash: "",
    blockNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const tickerRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const websiteLinkRef = useRef<HTMLInputElement>(null);
  const telegramLinkRef = useRef<HTMLInputElement>(null);
  const twitterLinkRef = useRef<HTMLInputElement>(null);
  const discordLinkRef = useRef<HTMLInputElement>(null);

  const createToken = async (name: string, symbol: string) => {
    try {
      console.log("Creating token with params:", { name, symbol });

      let value = parseEther(TOKEN_FACTORY_FEE || "0.1");

      if (formData.initialBuyAmount) {
        const parsed = parseEther(formData.initialBuyAmount);
        value = value + parsed;
      }

      const tx = await writeContractAsync({
        address: TOKEN_FACTORY_ADDRESS as `0x${string}`,
        abi: TokenFactoryABI,
        functionName: "createToken",
        value: value,
        args: [name, symbol],
      });

      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
        hash: tx,
      });

      const logs = parseEventLogs({
        abi: TokenFactoryABI,
        logs: receipt.logs,
      });

      const event: any = logs.find(
        (log: any) => log.eventName === "TokenCreated"
      );

      if (!event) throw new Error("Token creation event not found");

      return event.args.tokenAddress;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "image" && 'files' in e.target) {
      const file = e.target.files?.[0];

      if (file && file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: "Image size must be less than 10MB"
        });
        return;
      }

      setFormData({
        ...formData,
        image: file || null,
      });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: TokenFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Token name is required";
      isValid = false;
      nameRef.current?.focus();
    }

    if (!formData.ticker.trim()) {
      newErrors.ticker = "Token symbol is required";
      isValid = false;
      if (!newErrors.name) tickerRef.current?.focus();
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
      if (!newErrors.name && !newErrors.ticker) descriptionRef.current?.focus();
    }

    if (!formData.image) {
      newErrors.image = "Token image is required";
      isValid = false;
    } else if (formData.image.size > 5 * 1024 * 1024) {
      newErrors.image = "Image size must be less than 5MB";
      isValid = false;
    }

    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (formData.websiteLink && !urlRegex.test(formData.websiteLink)) {
      newErrors.websiteLink = "Please enter a valid URL";
      isValid = false;
      if (
        !newErrors.name &&
        !newErrors.ticker &&
        !newErrors.description &&
        !newErrors.image
      ) {
        websiteLinkRef.current?.focus();
      }
    }

    if (formData.telegramLink && !urlRegex.test(formData.telegramLink)) {
      newErrors.telegramLink = "Please enter a valid URL";
      isValid = false;
      if (
        !newErrors.name &&
        !newErrors.ticker &&
        !newErrors.description &&
        !newErrors.image &&
        !newErrors.websiteLink
      ) {
        telegramLinkRef.current?.focus();
      }
    }

    if (formData.twitterLink && !urlRegex.test(formData.twitterLink)) {
      newErrors.twitterLink = "Please enter a valid URL";
      isValid = false;
      if (
        !newErrors.name &&
        !newErrors.ticker &&
        !newErrors.description &&
        !newErrors.image &&
        !newErrors.websiteLink &&
        !newErrors.telegramLink
      ) {
        twitterLinkRef.current?.focus();
      }
    }

    if (formData.discordLink && !urlRegex.test(formData.discordLink)) {
      newErrors.discordLink = "Please enter a valid URL";
      isValid = false;
      if (
        !newErrors.name &&
        !newErrors.ticker &&
        !newErrors.description &&
        !newErrors.image &&
        !newErrors.websiteLink &&
        !newErrors.telegramLink &&
        !newErrors.twitterLink
      ) {
        discordLinkRef.current?.focus();
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }


    setIsLoading(true);
    try {
      toast.warn("PLEASE DO NOT CLOSE THIS PAGE WHILE CREATING A TOKEN WITHOUT ANY APPROVAL.");

      const newTokenAddress = await createToken(formData.name, formData.ticker);

      if (!newTokenAddress) {
        throw new Error("Token creation failed");
      }


      const _formData = new FormData();
      _formData.append("metadata[description]", formData.description);
      if (formData.image) {
        _formData.append("image", formData.image);
      }
      _formData.append("metadata[website_url]", formData.websiteLink);
      _formData.append("metadata[telegram_url]", formData.telegramLink);
      _formData.append("metadata[twitter_url]", formData.twitterLink);
      _formData.append("metadata[discord_url]", formData.discordLink);

      await new Promise(async (resolve, reject) => {
        let retryCount = 0;
        const maxRetries = 500;

        while (retryCount < maxRetries) {
          try {
            const result = await api.get(`/tokens/${newTokenAddress}/check`);
            if (result.data.exists === true) {
              return resolve(true);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            retryCount++;
          } catch (error) {
            console.error("Error checking token:", error);
            retryCount++;
          }
        }
        reject(new Error("Token indexing timed out"));
      });

      const response = await api.post(
        `/token-metadata/${newTokenAddress}`,
        _formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update token details");
      }

      setSuccessModal({
        isOpen: true,
        tokenAddress: newTokenAddress,
        transactionHash: "",
        blockNumber: "",
      });

      toast.success("Token created successfully! 🚀");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create token");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ ...successModal, isOpen: false });
  };

  return {
    formData,
    errors,
    successModal,
    isLoading,
    imagePreview,
    nameRef,
    tickerRef,
    descriptionRef,
    imageRef,
    websiteLinkRef,
    telegramLinkRef,
    twitterLinkRef,
    discordLinkRef,
    handleChange,
    handleSubmit,
    closeSuccessModal
  };
}; 